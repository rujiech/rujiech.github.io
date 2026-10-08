# Reproducible package-map data prep for the public interactive web map.
#
# Assumptions and location enrichment notes:
# - Main input is arsenicDec22_2023.csv.
# - The CSV inspected on 2026-04-15 contains no municipality, zipcode,
#   address, geometry, or geography fields. It does contain X/Y, which are
#   treated as longitude/latitude in EPSG:4326, matching Practicum_0415.Rmd.
# - Raw measured arsenic is preserved in the output tooltip field `arsenic`.
# - Municipality/ZIP are never fabricated. If those fields already exist in the
#   input, they are preserved. Otherwise this script attempts reproducible
#   polygon joins using Census TIGER/Line through `tigris`: county subdivisions
#   for the municipality display field and ZCTAs for ZIP-like geography. County
#   subdivisions cover unincorporated areas more completely than incorporated
#   places, but they are not the same thing as city/town governments. ZCTAs are
#   Census ZIP Code Tabulation Areas, not USPS delivery ZIPs.
# - Address is not derivable from the local files. It is left blank by default.
#   A reverse-geocoding step should be added only with a documented provider,
#   stable terms of use, rate limits, and cached results.
# - Package versions and thresholds are copied from Practicum_0415.Rmd:
#     Screening-First     = simplified glmnet, threshold 0.2
#     Confirmation-First  = full random forest, threshold 0.5
#     Explanation-First   = simplified random forest, threshold 0.3
#
# Outputs:
# - package_map_long.geojson
# - package_map_long.csv

suppressPackageStartupMessages({
  library(caret)
  library(dplyr)
  library(e1071)
  library(glmnet)
  library(purrr)
  library(randomForest)
  library(readr)
  library(sf)
  library(stringr)
  library(tibble)
  library(tidyr)
})

params <- list(
  data_file = "arsenicDec22_2023.csv",
  outline_shp = file.path("gastonCountyOutline", "gaston_outline_Project.shp"),
  target = "new_arsenic",
  positive_label = "pos",
  negative_label = "neg",
  seed = 123,
  tune_length = 5,
  cv_folds = 5,
  cv_repeats = 2
)

set.seed(params$seed)

required_packages <- c(
  "caret", "dplyr", "e1071", "glmnet", "randomForest", "readr", "sf",
  "stringr", "tibble", "tidyr"
)
missing_packages <- required_packages[!vapply(required_packages, requireNamespace, logical(1), quietly = TRUE)]
if (length(missing_packages) > 0) {
  stop(
    "Install missing packages before running this script: ",
    paste(missing_packages, collapse = ", "),
    call. = FALSE
  )
}

to_class_factor <- function(y01, pos_label = "pos", neg_label = "neg") {
  y01 <- as.integer(y01)
  factor(ifelse(y01 == 1, pos_label, neg_label), levels = c(pos_label, neg_label))
}

enforce_class_levels <- function(d) {
  d$Class <- factor(d$Class, levels = c(params$positive_label, params$negative_label))
  d
}

apply_imbalance <- function(train_df) {
  train_df$Class <- factor(train_df$Class, levels = c(params$positive_label, params$negative_label))
  out <- caret::upSample(
    x = train_df %>% dplyr::select(-Class),
    y = train_df$Class,
    yname = "Class"
  )
  out$Class <- factor(out$Class, levels = c(params$positive_label, params$negative_label))
  out %>% dplyr::slice_sample(prop = 1)
}

ctrl_cv <- caret::trainControl(
  method = "repeatedcv",
  number = params$cv_folds,
  repeats = params$cv_repeats,
  classProbs = TRUE,
  summaryFunction = caret::twoClassSummary,
  savePredictions = "final",
  allowParallel = FALSE,
  verboseIter = FALSE
)

first_matching_col <- function(nms, candidates) {
  hits <- nms[tolower(nms) %in% tolower(candidates)]
  if (length(hits) == 0) NA_character_ else hits[[1]]
}

parse_point_geometry <- function(data) {
  geom_col <- first_matching_col(names(data), c("geometry", "geography", "geom", "wkt"))

  if (!is.na(geom_col)) {
    parsed <- tryCatch(
      sf::st_as_sfc(data[[geom_col]], crs = 4326),
      error = function(e) NULL
    )

    if (!is.null(parsed)) {
      parsed <- sf::st_cast(parsed, "POINT", warn = FALSE)
      coords <- sf::st_coordinates(parsed)
      return(tibble(longitude = coords[, 1], latitude = coords[, 2]))
    }
  }

  stopifnot("X" %in% names(data), "Y" %in% names(data))
  tibble(longitude = as.numeric(data$X), latitude = as.numeric(data$Y))
}

coalesce_existing_location_fields <- function(data) {
  municipality_col <- first_matching_col(names(data), c("municipality", "muni", "city", "town", "place"))
  zipcode_col <- first_matching_col(names(data), c("zipcode", "zip_code", "zip", "postal_code", "postalcode"))
  address_col <- first_matching_col(names(data), c("address", "street_address", "site_address", "full_address"))

  tibble(
    municipality = if (!is.na(municipality_col)) as.character(data[[municipality_col]]) else rep(NA_character_, nrow(data)),
    zipcode = if (!is.na(zipcode_col)) as.character(data[[zipcode_col]]) else rep(NA_character_, nrow(data)),
    address = if (!is.na(address_col)) as.character(data[[address_col]]) else rep(NA_character_, nrow(data))
  )
}

enrich_municipality_zip <- function(points_sf, location_df) {
  needs_muni <- all(is.na(location_df$municipality) | location_df$municipality == "")
  needs_zip <- all(is.na(location_df$zipcode) | location_df$zipcode == "")

  if (!needs_muni && !needs_zip) return(location_df)

  if (!requireNamespace("tigris", quietly = TRUE)) {
    message("Package `tigris` is not installed; municipality/ZIP will remain blank where absent.")
    return(location_df)
  }

  dir.create("tigris_cache", showWarnings = FALSE, recursive = TRUE)
  Sys.setenv(TIGRIS_CACHE_DIR = normalizePath("tigris_cache", winslash = "/", mustWork = TRUE))

  old_tigris_class <- getOption("tigris_class")
  old_tigris_use_cache <- getOption("tigris_use_cache")
  on.exit({
    options(tigris_class = old_tigris_class)
    options(tigris_use_cache = old_tigris_use_cache)
  }, add = TRUE)

  options(tigris_class = "sf", tigris_use_cache = TRUE)
  points_4326 <- sf::st_transform(points_sf, 4326)

  if (needs_muni) {
    subdivisions <- tryCatch(
      tigris::county_subdivisions(state = "NC", county = "Gaston", cb = TRUE, year = 2023, progress_bar = FALSE),
      error = function(e) {
        message("County subdivision TIGER download/join failed: ", e$message)
        NULL
      }
    )

    if (!is.null(subdivisions)) {
      subdivisions <- subdivisions %>%
        sf::st_transform(4326) %>%
        dplyr::select(municipality_join = NAME)

      muni_join <- sf::st_join(points_4326, subdivisions, left = TRUE) %>%
        sf::st_drop_geometry() %>%
        dplyr::pull(municipality_join)

      location_df$municipality <- dplyr::coalesce(location_df$municipality, as.character(muni_join))
    }
  }

  if (needs_zip) {
    zctas <- tryCatch(
      tigris::zctas(cb = TRUE, starts_with = "28", year = 2020, progress_bar = FALSE),
      error = function(e) {
        message("ZCTA TIGER download/join failed: ", e$message)
        NULL
      }
    )

    if (!is.null(zctas)) {
      zctas <- zctas %>%
        sf::st_transform(4326) %>%
        dplyr::select(zipcode_join = ZCTA5CE20)

      zip_join <- sf::st_join(points_4326, zctas, left = TRUE) %>%
        sf::st_drop_geometry() %>%
        dplyr::pull(zipcode_join)

      location_df$zipcode <- dplyr::coalesce(location_df$zipcode, as.character(zip_join))
    }
  }

  location_df
}

build_base_model_data <- function(data1) {
  variables <- c(
    "new_arsenic", "DensityWel", "Curvature", "DistBrown", "DisHazSite", "DistlnaHaS",
    "DisRUST", "Slope", "TPI", "TRI", "TWI", "DEM", "DisALa", "DisDam", "DisCoalAsh",
    "Zinc", "Hardness", "Alkalinity", "Sodium", "Calcium", "Sulfate", "Nitrate",
    "Fluoride", "Iron", "Magnesium", "Manganese", "Chloride", "Barium", "mica",
    "newPH", "AutoCov"
  )

  vars_present <- intersect(variables, names(data1))
  data_extracted <- data1[, vars_present, drop = FALSE]
  stopifnot(params$target %in% names(data_extracted))
  data_extracted[[params$target]] <- as.integer(data_extracted[[params$target]])

  y <- data_extracted[[params$target]]
  X <- data_extracted %>% dplyr::select(-all_of(params$target))

  for (nm in names(X)) {
    if (is.numeric(X[[nm]]) || is.integer(X[[nm]])) {
      med <- median(X[[nm]], na.rm = TRUE)
      X[[nm]][is.na(X[[nm]])] <- med
    } else {
      X[[nm]] <- as.factor(X[[nm]])
      mode_val <- names(sort(table(X[[nm]]), decreasing = TRUE))[1]
      X[[nm]][is.na(X[[nm]])] <- mode_val
    }
  }

  df_base <- bind_cols(X, !!params$target := y)
  df_base$Class <- to_class_factor(df_base[[params$target]], params$positive_label, params$negative_label)
  df_base %>% dplyr::select(-all_of(params$target))
}

build_full_dataset <- function(df_base) {
  df_full <- df_base
  original_features <- setdiff(names(df_base), "Class")

  if (all(c("Calcium", "Magnesium") %in% names(df_full))) {
    df_full$Ca_Mg_ratio <- df_full$Calcium / (df_full$Magnesium + 0.01)
  }
  if (all(c("Sodium", "Chloride") %in% names(df_full))) {
    df_full$Na_Cl_ratio <- df_full$Sodium / (df_full$Chloride + 0.01)
  }
  if (all(c("Iron", "Manganese") %in% names(df_full))) {
    df_full$Fe_Mn_ratio <- df_full$Iron / (df_full$Manganese + 0.001)
  }

  log_candidates <- c()
  for (nm in original_features) {
    if (is.numeric(df_full[[nm]])) {
      skew_val <- e1071::skewness(df_full[[nm]], na.rm = TRUE)
      if (!is.na(skew_val) && abs(skew_val) > 1) log_candidates <- c(log_candidates, nm)
    }
  }

  for (nm in unique(log_candidates)) {
    min_val <- min(df_full[[nm]], na.rm = TRUE)
    offset <- ifelse(min_val <= 0, abs(min_val) + 1, 0)
    df_full[[paste0("log_", nm)]] <- log(df_full[[nm]] + offset)
  }

  poly_candidates <- intersect(
    c("DEM", "Slope", "TWI", "TPI", "TRI", "Hardness", "Alkalinity", "Sulfate", "Nitrate", "newPH"),
    names(df_full)
  )
  for (nm in poly_candidates) {
    if (is.numeric(df_full[[nm]])) df_full[[paste0(nm, "_sq")]] <- df_full[[nm]]^2
  }

  if (all(c("Sulfate", "Chloride") %in% names(df_full))) df_full$SO4_Cl_ratio <- df_full$Sulfate / (df_full$Chloride + 0.01)
  if (all(c("Hardness", "Alkalinity") %in% names(df_full))) df_full$Hard_Alk_ratio <- df_full$Hardness / (df_full$Alkalinity + 0.01)
  if (all(c("Nitrate", "Sulfate") %in% names(df_full))) df_full$NO3_SO4_ratio <- df_full$Nitrate / (df_full$Sulfate + 0.01)
  if (all(c("TRI", "TPI") %in% names(df_full))) df_full$TRI_TPI_ratio <- df_full$TRI / (abs(df_full$TPI) + 0.01)
  if (all(c("Slope", "TWI") %in% names(df_full))) df_full$Slope_TWI_ratio <- df_full$Slope / (df_full$TWI + 0.01)

  if (all(c("DEM", "DistBrown") %in% names(df_full))) df_full$DEM_x_DistBrown <- df_full$DEM * df_full$DistBrown
  if (all(c("Slope", "TWI") %in% names(df_full))) df_full$Slope_x_TWI <- df_full$Slope * df_full$TWI
  if (all(c("DEM", "TWI") %in% names(df_full))) df_full$DEM_x_TWI <- df_full$DEM * df_full$TWI
  if (all(c("newPH", "Hardness") %in% names(df_full))) df_full$pH_x_Hardness <- df_full$newPH * df_full$Hardness
  if (all(c("newPH", "Iron") %in% names(df_full))) df_full$pH_x_Iron <- df_full$newPH * df_full$Iron
  if (all(c("Alkalinity", "newPH") %in% names(df_full))) df_full$Alk_x_pH <- df_full$Alkalinity * df_full$newPH
  if (all(c("DensityWel", "Nitrate") %in% names(df_full))) df_full$WellDens_x_Nitrate <- df_full$DensityWel * df_full$Nitrate
  if (all(c("DisHazSite", "Iron") %in% names(df_full))) df_full$HazSite_x_Iron <- df_full$DisHazSite * df_full$Iron

  for (nm in names(df_full)) {
    if (is.numeric(df_full[[nm]])) {
      df_full[[nm]][is.infinite(df_full[[nm]])] <- NA
      df_full[[nm]][is.nan(df_full[[nm]])] <- NA
      if (any(is.na(df_full[[nm]]))) df_full[[nm]][is.na(df_full[[nm]])] <- median(df_full[[nm]], na.rm = TRUE)
    }
  }

  df_full$Class <- factor(df_full$Class, levels = c(params$positive_label, params$negative_label))

  nzv <- caret::nearZeroVar(df_full %>% dplyr::select(-Class), saveMetrics = TRUE)
  nzv_remove <- rownames(nzv)[nzv$nzv]
  if (length(nzv_remove) > 0) df_full <- df_full %>% dplyr::select(-all_of(nzv_remove))

  is_engineered <- function(x) grepl("^log_", x) | grepl("_sq$", x) | grepl("_x_", x) | grepl("_ratio$", x)
  removal_priority <- function(x) ifelse(is_engineered(x), 1L, 0L)

  numeric_cols <- df_full %>% dplyr::select(-Class) %>% dplyr::select(where(is.numeric))
  if (ncol(numeric_cols) >= 2) {
    cor_matrix <- cor(numeric_cols, use = "pairwise.complete.obs")
    cn <- colnames(cor_matrix)
    to_remove <- character(0)
    pr <- setNames(removal_priority(cn), cn)
    cutoff <- 0.95

    for (j in 2:length(cn)) {
      for (k in 1:(j - 1)) {
        v1 <- cn[k]
        v2 <- cn[j]
        if (v1 %in% to_remove || v2 %in% to_remove) next
        r <- cor_matrix[v1, v2]
        if (is.na(r)) next
        if (abs(r) >= cutoff) {
          if (pr[v1] > pr[v2]) {
            to_remove <- c(to_remove, v1)
          } else if (pr[v2] > pr[v1]) {
            to_remove <- c(to_remove, v2)
          } else {
            avg1 <- mean(abs(cor_matrix[v1, ]), na.rm = TRUE)
            avg2 <- mean(abs(cor_matrix[v2, ]), na.rm = TRUE)
            to_remove <- c(to_remove, ifelse(avg1 >= avg2, v1, v2))
          }
        }
      }
    }

    if (length(unique(to_remove)) > 0) df_full <- df_full %>% dplyr::select(-all_of(unique(to_remove)))
  }

  df_full %>% dplyr::select(Class, dplyr::everything()) %>% enforce_class_levels()
}

build_simplified_dataset <- function(df_base) {
  df_interpretable <- df_base
  original_features <- setdiff(names(df_base), "Class")

  if (all(c("Calcium", "Magnesium") %in% names(df_interpretable))) {
    df_interpretable$Ca_Mg_ratio <- df_interpretable$Calcium / (df_interpretable$Magnesium + 0.01)
  }
  if (all(c("Sodium", "Chloride") %in% names(df_interpretable))) {
    df_interpretable$Na_Cl_ratio <- df_interpretable$Sodium / (df_interpretable$Chloride + 0.01)
  }
  if (all(c("Iron", "Manganese") %in% names(df_interpretable))) {
    df_interpretable$Fe_Mn_ratio <- df_interpretable$Iron / (df_interpretable$Manganese + 0.001)
  }

  for (nm in names(df_interpretable)) {
    if (is.numeric(df_interpretable[[nm]])) {
      df_interpretable[[nm]][is.infinite(df_interpretable[[nm]])] <- NA
      if (any(is.na(df_interpretable[[nm]]))) {
        df_interpretable[[nm]][is.na(df_interpretable[[nm]])] <- median(df_interpretable[[nm]], na.rm = TRUE)
      }
    }
  }

  new_features <- setdiff(names(df_interpretable), c(original_features, "Class"))
  message("Added interpretable ratio features: ", paste(new_features, collapse = ", "))

  df_interpretable$Class <- factor(df_interpretable$Class, levels = c(params$positive_label, params$negative_label))
  nzv_i <- caret::nearZeroVar(df_interpretable %>% dplyr::select(-Class), saveMetrics = TRUE)
  nzv_remove_i <- rownames(nzv_i)[nzv_i$nzv]
  if (length(nzv_remove_i) > 0) df_interpretable <- df_interpretable %>% dplyr::select(-all_of(nzv_remove_i))

  df_interpretable %>% dplyr::select(Class, dplyr::everything()) %>% enforce_class_levels()
}

fit_final_package <- function(df_model, model_name) {
  train_bal <- apply_imbalance(df_model)

  if (model_name == "glmnet") {
    caret::train(
      Class ~ .,
      data = train_bal,
      method = "glmnet",
      metric = "ROC",
      trControl = ctrl_cv,
      tuneLength = params$tune_length,
      preProcess = c("center", "scale")
    )
  } else if (model_name == "rf") {
    caret::train(
      Class ~ .,
      data = train_bal,
      method = "rf",
      metric = "ROC",
      trControl = ctrl_cv,
      tuneLength = params$tune_length
    )
  } else {
    stop("Unsupported model: ", model_name, call. = FALSE)
  }
}

message("Reading input data...")
data1 <- readr::read_csv(params$data_file, show_col_types = FALSE)

if ("DEM" %in% names(data1)) {
  data1 <- data1[!is.na(data1$DEM), ]
  data1 <- data1[data1$DEM != 0, ]
}

coords_df <- parse_point_geometry(data1)
location_df <- coalesce_existing_location_fields(data1)

points_sf <- sf::st_as_sf(
  bind_cols(coords_df, location_df),
  coords = c("longitude", "latitude"),
  crs = 4326,
  remove = FALSE
)

if (file.exists(params$outline_shp)) {
  gaston_outline <- sf::st_read(params$outline_shp, quiet = TRUE)
  within_gaston <- lengths(sf::st_intersects(
    sf::st_transform(points_sf, sf::st_crs(gaston_outline)),
    gaston_outline
  )) > 0
  if (any(!within_gaston, na.rm = TRUE)) {
    warning(sum(!within_gaston, na.rm = TRUE), " input points fall outside the Gaston outline.")
  }
} else {
  warning("County outline shapefile not found at ", params$outline_shp)
}

location_df <- enrich_municipality_zip(points_sf, location_df)
location_df$address <- dplyr::coalesce(location_df$address, "")
location_df$municipality <- dplyr::coalesce(location_df$municipality, "")
location_df$zipcode <- dplyr::coalesce(location_df$zipcode, "")

message("Building model datasets...")
df_base <- build_base_model_data(data1)
stopifnot(nrow(coords_df) == nrow(df_base), nrow(location_df) == nrow(df_base))

full_df <- build_full_dataset(df_base)
simplified_df <- build_simplified_dataset(df_base)

message("Fitting final package models...")
final_fits <- list(
  screening = fit_final_package(simplified_df, "glmnet"),
  confirmation = fit_final_package(full_df, "rf"),
  explanation = fit_final_package(simplified_df, "rf")
)

pred_screening <- predict(
  final_fits$screening,
  newdata = simplified_df %>% dplyr::select(-Class),
  type = "prob"
)[[params$positive_label]]

pred_confirmation <- predict(
  final_fits$confirmation,
  newdata = full_df %>% dplyr::select(-Class),
  type = "prob"
)[[params$positive_label]]

pred_explanation <- predict(
  final_fits$explanation,
  newdata = simplified_df %>% dplyr::select(-Class),
  type = "prob"
)[[params$positive_label]]

id_vec <- if ("OBJECTID" %in% names(data1)) as.character(data1$OBJECTID) else as.character(seq_len(nrow(data1)))

base_output <- tibble(
  id = id_vec,
  arsenic = as.numeric(data1$arsenic),
  longitude = coords_df$longitude,
  latitude = coords_df$latitude,
  municipality = location_df$municipality,
  zipcode = location_df$zipcode,
  address = location_df$address
)

message("Creating long-format package map data...")
package_map_long <- bind_rows(
  base_output %>%
    mutate(package_name = "Screening-First", threshold = 0.2, prob = as.numeric(pred_screening)),
  base_output %>%
    mutate(package_name = "Confirmation-First", threshold = 0.5, prob = as.numeric(pred_confirmation)),
  base_output %>%
    mutate(package_name = "Explanation-First", threshold = 0.3, prob = as.numeric(pred_explanation))
) %>%
  mutate(
    status = ifelse(prob >= threshold, "Exceedance", "No exceedance"),
    package_name = factor(package_name, levels = c("Screening-First", "Confirmation-First", "Explanation-First")),
    status = factor(status, levels = c("Exceedance", "No exceedance"))
  ) %>%
  select(
    id, package_name, threshold, prob, status, arsenic,
    municipality, zipcode, address, longitude, latitude
  )

package_map_sf <- sf::st_as_sf(
  package_map_long,
  coords = c("longitude", "latitude"),
  crs = 4326,
  remove = FALSE
)

sf::st_write(package_map_sf, "package_map_long.geojson", delete_dsn = TRUE, quiet = TRUE)
readr::write_csv(sf::st_drop_geometry(package_map_sf), "package_map_long.csv")

message("Wrote package_map_long.geojson and package_map_long.csv")
