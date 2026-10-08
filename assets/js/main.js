(function () {
  const projects = window.PORTFOLIO_PROJECTS || [];
  const unpublishedProjects = window.PORTFOLIO_UNPUBLISHED_PROJECTS || [];
  const groups = window.PORTFOLIO_GROUPS || [];
  // Dates describe participation; stable sorting retains the prior order for ties.
  function participationOrder(a, b) {
    const period = (project) => {
      const [start, end = start] = (project.year || "").split(" – ");
      return [end === "Present" ? Infinity : Number(end), Number(start)];
    };
    const [aEnd, aStart] = period(a);
    const [bEnd, bStart] = period(b);
    return (aEnd === bEnd ? 0 : bEnd - aEnd) || bStart - aStart;
  }
  const listingProjects = groups.flatMap((group) => [
    ...projects.filter((project) => project.listed !== false && project.group === group.id),
    ...unpublishedProjects.filter((project) => project.listed !== false && project.group === group.id).map((project) => ({ ...project, unpublished: true }))
  ].sort((a, b) => (a.order || 999) - (b.order || 999))).sort(participationOrder);
  const listedProjects = listingProjects.filter((project) => !project.unpublished);

  const groupedProjects = groups.filter((group) => group.visible !== false).map((group) => ({
    ...group,
    projects: listingProjects.filter((project) => project.group === group.id)
  }));
  // Preserve the current Projects card order for both listing and navigation.
  groupedProjects.forEach((group) => {
    const covid = group.projects.findIndex((project) => project.slug === "covid-resource-deployment");
    const indego = group.projects.findIndex((project) => project.slug === "indego-rebalance-analysis");
    if (covid !== -1 && indego !== -1) {
      [group.projects[covid], group.projects[indego]] = [group.projects[indego], group.projects[covid]];
    }
  });

  const navigationProjects = groupedProjects.flatMap((group) => group.projects).filter((project) => !project.unpublished);
  const page = document.body.dataset.page;

  const emailControls = document.querySelectorAll("[data-copy-email]");
  if (emailControls.length) {
    const feedback = document.createElement("div");
    feedback.className = "email-copy-feedback";
    feedback.setAttribute("role", "status");
    feedback.setAttribute("aria-live", "polite");
    feedback.setAttribute("aria-atomic", "true");
    document.body.append(feedback);
    let feedbackTimer;
    let copyPending = false;

    async function copyEmail(address) {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(address);
        return;
      }
      // Support local previews and older browsers; only report verified success.
      const selection = window.getSelection();
      const ranges = selection ? Array.from({ length: selection.rangeCount }, (_, i) => selection.getRangeAt(i).cloneRange()) : [];
      const active = document.activeElement;
      const input = document.createElement("textarea");
      input.value = address;
      input.className = "email-copy-buffer";
      input.setAttribute("readonly", "");
      document.body.append(input);
      try {
        input.select();
        if (!document.execCommand("copy")) throw new Error("Copy failed");
      } finally {
        input.remove();
        active?.focus({ preventScroll: true });
        if (selection) {
          selection.removeAllRanges();
          ranges.forEach((range) => selection.addRange(range));
        }
      }
    }

    emailControls.forEach((control) => {
      control.addEventListener("keydown", (event) => {
        if (event.key === " " || event.key === "Enter") {
          event.preventDefault();
          if (!event.repeat) control.click();
        }
      });
      control.addEventListener("click", async (event) => {
        event.preventDefault();
        if (copyPending) return;
        copyPending = true;
        clearTimeout(feedbackTimer);
        feedback.textContent = "";
        feedback.classList.remove("is-visible");
        let message;
        try {
          await copyEmail(control.dataset.copyEmail);
          message = "Email copied!";
        } catch {
          message = "Couldn’t copy. Please select and copy the email address.";
        } finally {
          copyPending = false;
        }
        feedback.textContent = message;
        feedback.classList.add("is-visible");
        const rect = control.getBoundingClientRect();
        const x = event.detail ? event.clientX : rect.left + rect.width / 2;
        const y = event.detail ? event.clientY : rect.top;
        const width = feedback.offsetWidth;
        const height = feedback.offsetHeight;
        feedback.style.left = `${Math.max(8, Math.min(x - width / 2, window.innerWidth - width - 8))}px`;
        feedback.style.top = `${Math.max(8, Math.min(y - height - 12, window.innerHeight - height - 8))}px`;
        feedbackTimer = setTimeout(() => {
          feedback.classList.remove("is-visible");
          feedback.textContent = "";
        }, message === "Email copied!" ? 2000 : 6000);
      });
    });
  }

  function groupTitle(project) {
    return groups.find((group) => group.id === project.group)?.title || "";
  }

  document.querySelectorAll("[data-year]").forEach((node) => {
    node.textContent = new Date().getFullYear();
  });

  const navToggle = document.querySelector(".nav-toggle");
  const navLinks = document.querySelector(".nav-links");
  if (navToggle && navLinks) {
    navToggle.addEventListener("click", () => {
      const isOpen = navToggle.getAttribute("aria-expanded") === "true";
      navToggle.setAttribute("aria-expanded", String(!isOpen));
      document.body.classList.toggle("nav-open", !isOpen);
    });
  }

  const currentPath = location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".nav-links a").forEach((link) => {
    if (link.getAttribute("href") === currentPath || (page === "project" && link.getAttribute("href") === "projects.html")) {
      link.setAttribute("aria-current", "page");
    }
  });

  function escapeHtml(value) {
    return String(value || "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function projectIntro(project) {
    const intro = escapeHtml(project.summary || project.subtitle);
    if (!project.introLink) return intro;
    const label = escapeHtml(project.introLink.label);
    return intro.replace(label, `<a href="${escapeHtml(project.introLink.url)}" target="_blank" rel="noopener noreferrer">${label}</a>`);
  }

  function projectUrl(project) {
    return project.detailPage || `project.html?slug=${encodeURIComponent(project.slug)}`;
  }

  function tagList(tags) {
    return `<ul class="tag-list">${(tags || []).map((tag) => `<li>${escapeHtml(tag)}</li>`).join("")}</ul>`;
  }

  function compactList(items, className = "") {
    return `<ul class="${className}">${items.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>`;
  }

  function projectCard(project, featured = false) {
    return `
      <article class="project-card ${featured ? "project-card-featured" : ""}">
        <a class="project-image-link" href="${projectUrl(project)}" aria-label="View ${escapeHtml(project.title)}">
          <img src="${escapeHtml(project.thumbnail)}" alt="${escapeHtml(project.thumbnailAlt || project.heroAlt || project.title)}" loading="lazy" data-fallback>
        </a>
        <div class="project-card-body">
          ${page === "projects" ? "" : `<div class="project-meta-line">
            <span>${escapeHtml(groupTitle(project))}</span>
            <span>${escapeHtml(project.year)}</span>
          </div>`}
          <h3><a href="${projectUrl(project)}">${escapeHtml(project.title)}</a></h3>
          <p>${escapeHtml((featured && project.featuredDescription) || project.subtitle || project.summary)}</p>
          ${project.focusAreas?.length ? tagList(project.focusAreas) : ""}
        </div>
      </article>
    `;
  }

  function unpublishedProjectCard(project) {
    return `
      <article class="project-card project-card-pending">
        <div class="project-card-body">
          <p class="project-card-status">Case study forthcoming</p>
          <h3>${escapeHtml(project.title)}</h3>
          ${project.focusAreas?.length ? tagList(project.focusAreas) : ""}
        </div>
      </article>
    `;
  }

  const featuredMount = document.querySelector("[data-featured-projects]");
  if (featuredMount) {
    featuredMount.innerHTML = ["allegheny-forward", "fox-chase-burholme-active-transportation-plan", "lancaster-park-city-center", "arsenic-private-wells"].map((slug) => listedProjects.find((project) => project.slug === slug)).filter(Boolean).map((project) => projectCard(project, true)).join("");
  }

  const indexMount = document.querySelector("[data-project-index]");
  if (indexMount) {

    indexMount.innerHTML = `
      <div class="project-category-navigation">
      <p class="project-toc-label" id="project-categories-label">Browse by category</p>
      <nav class="project-toc" aria-labelledby="project-categories-label">
        ${groupedProjects.map((group) => `
          <a href="#${escapeHtml(group.id)}">
            <span>${escapeHtml(group.title)}</span>
            <span class="project-toc-arrow" aria-hidden="true">↓</span>
          </a>
        `).join("")}
      </nav>
      </div>
      ${groupedProjects.map((group) => `
        <section class="project-group" id="${escapeHtml(group.id)}" aria-labelledby="${escapeHtml(group.id)}-heading">
          <div class="project-group-heading">
            <div>
              <h2 id="${escapeHtml(group.id)}-heading">${escapeHtml(group.title)}</h2>
              <p>${escapeHtml(group.description)}</p>
            </div>
          </div>
          ${group.projects.length
            ? `<div class="project-index-grid">${group.projects.map((project) => project.unpublished ? unpublishedProjectCard(project) : projectCard(project)).join("")}</div>`
            : ""}
        </section>
      `).join("")}
    `;
  }

  // Position cards without changing DOM or keyboard order. Each group keeps its
  // existing chronological order, with ties placed in the left column.
  if (page === "projects" && indexMount) {
    const grids = [...indexMount.querySelectorAll(".project-index-grid")];
    let frame;
    function layoutProjects() {
      grids.forEach((grid) => {
        const columns = window.matchMedia("(max-width: 520px)").matches ? 1 : 2;
        const gap = parseFloat(getComputedStyle(grid).columnGap);
        const width = (grid.clientWidth - gap * (columns - 1)) / columns;
        const heights = Array(columns).fill(0);
        grid.classList.add("project-masonry");
        [...grid.children].forEach((card) => {
          card.style.width = `${width}px`;
          const column = heights.indexOf(Math.min(...heights));
          card.style.left = `${column * (width + gap)}px`;
          card.style.top = `${heights[column]}px`;
          heights[column] += card.offsetHeight + gap;
        });
        grid.style.height = `${Math.max(0, ...heights) - (grid.children.length ? gap : 0)}px`;
      });
    }
    function scheduleLayout() {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(layoutProjects);
    }
    const observer = new ResizeObserver(scheduleLayout);
    grids.forEach((grid) => {
      observer.observe(grid);
      [...grid.children].forEach((card) => observer.observe(card));
    });
    indexMount.addEventListener("load", scheduleLayout, true);
    indexMount.addEventListener("error", scheduleLayout, true);
    window.addEventListener("resize", scheduleLayout);
    document.fonts.ready.then(scheduleLayout);
    layoutProjects();
  }

  function projectMetaLine(project) {
    const primary = [project.displayYear || project.year, project.location, project.projectType].filter(Boolean);
    if (!primary.length && !project.clientName) return "";
    return `
      <div class="project-meta-block">
        ${primary.length ? compactList(primary, "project-meta-strip") : ""}
        ${project.clientName ? compactList([`Client: ${project.clientName}`], "project-meta-strip project-meta-strip-secondary") : ""}
      </div>
    `;
  }

  function focusAreas(project) {
    const items = project.focusAreas || [];
    if (!items.length) return "";
    return `
      <div class="focus-area-block" aria-label="Focus areas">
        ${tagList(items)}
      </div>
    `;
  }

  function reportLinkLabel(link) {
    const label = escapeHtml(link.label);
    if (!/report/i.test(link.label)) return label;
    const text = /^(view|read).*report$/i.test(link.label) ? "View full report" : label;
    return text + ' <svg class="report-link-arrow" aria-hidden="true" width="12" height="12" viewBox="0 0 16 16" fill="none"><path d="M3 13 13 3M4 3h9v9" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  }

  function topLinks(project) {
    if (!project.fullReport && !project.primaryLink) return "";
    const links = [project.fullReport, project.primaryLink].filter(Boolean);
    return `
      <div class="case-top-links">
        ${links.map((link) => `<a class="text-link" href="${escapeHtml(link.url)}"${link.newTab ? ' target="_blank" rel="noopener noreferrer"' : ''}>${reportLinkLabel(link)}</a>`).join("")}
      </div>
    `;
  }

  function methodRow(label, values) {
    if (!values || !values.length) return "";
    return `<div><dt>${escapeHtml(label)}</dt><dd>${escapeHtml(values.join(" · "))}</dd></div>`;
  }

  function methodsAndData(project) {
    const content = [
      methodRow("Tools", project.tools),
      methodRow("Methods", project.methods)
    ].join("");
    if (!content) return "";
    return `
      <section class="case-section supporting-info">
        <p class="eyebrow">Tools & Methods</p>
        <dl>${content}</dl>
      </section>
    `;
  }

  function imageFigure(item, className = "") {
    if (item.map) return `<figure class="case-image ${className}"><iframe class="portfolio-map" src="${escapeHtml(item.map)}" title="Explore arsenic screening strategies in Gaston County"></iframe><figcaption>${escapeHtml(item.caption || "")} <a href="${escapeHtml(item.map)}" target="_blank" rel="noopener">Open the map independently ↗</a></figcaption></figure>`;
    return `
      <figure class="case-image ${className}">
        <button class="image-button" type="button" data-lightbox="${escapeHtml(item.image)}" aria-label="Open larger image">
          <img src="${escapeHtml(item.image)}" alt="${escapeHtml(item.alt || item.caption || "")}" loading="lazy" data-fallback>
        </button>
        ${item.caption ? `<figcaption>${escapeHtml(item.caption)}</figcaption>` : ""}
      </figure>
    `;
  }

  function sectionParagraph(paragraph, link) {
    const text = escapeHtml(paragraph);
    if (!link || !paragraph.includes(link.label)) return text;
    return text.replace(escapeHtml(link.label), '<a href="' + escapeHtml(link.url) + '">' + reportLinkLabel(link) + '</a>');
  }

  function renderSection(section) {
    if (section.type === "group") return `<section class="case-section"><div class="case-text"><h2>${escapeHtml(section.title)}</h2></div>${(section.sections || []).map(renderSection).join("")}</section>`;
    if (section.type === "project-credits") return section.html;
    if (section.type === "text") {
      if (section.media) {
        return `
          <section class="case-section case-text-media">
            ${section.eyebrow ? `<p class="eyebrow">${escapeHtml(section.eyebrow)}</p>` : ""}
            ${section.title ? `<h2>${escapeHtml(section.title)}</h2>` : ""}
            <div class="case-media-layout">
              <div class="case-text-copy">${(section.body || []).map((paragraph) => `<p>${sectionParagraph(paragraph, section.inlineLink)}</p>`).join("")}</div>
              ${imageFigure(section.media)}
            </div>
          </section>
        `;
      }
      return `
        <section class="case-section case-text">
          ${section.eyebrow ? `<p class="eyebrow">${escapeHtml(section.eyebrow)}</p>` : ""}
          ${section.title ? `<h2>${escapeHtml(section.title)}</h2>` : ""}
          ${(section.body || []).map((paragraph) => `<p>${sectionParagraph(paragraph, section.inlineLink)}</p>`).join("")}
          ${section.bullets ? `<ul>${section.bullets.map((item) => `<li><strong>${escapeHtml(item.label)}</strong> ${escapeHtml(item.text)}</li>`).join("")}</ul>` : ""}
          ${(section.bodyAfter || []).map((paragraph) => `<p>${sectionParagraph(paragraph, section.inlineLink)}</p>`).join("")}
        </section>
      `;
    }
    if (section.type === "image") {
      return `<section class="case-section">${imageFigure(section, "full")}</section>`;
    }
    if (section.type === "split") {
      return `<section class="case-section image-pair">${(section.images || []).map((item) => imageFigure(item)).join("")}</section>`;
    }
    if (section.type === "gallery") {
      return `
        <section class="case-section case-gallery">
          ${section.title ? `<h2>${escapeHtml(section.title)}</h2>` : ""}
          ${section.body ? `<p>${escapeHtml(section.body)}</p>` : ""}
          ${section.caption ? `<figure class="case-image"><div class="image-gallery">${(section.images || []).map((item) => imageFigure(item)).join("")}</div><figcaption>${escapeHtml(section.caption)}</figcaption></figure>` : `<div class="image-gallery">${(section.images || []).map((item) => imageFigure(item)).join("")}</div>`}
        </section>
      `;
    }
    if (section.type === "links") {
      return `
        <section class="case-section case-links">
          ${section.title ? `<h2>${escapeHtml(section.title)}</h2>` : ""}
          <div class="inline-actions">
            ${(section.links || []).map((link) => `<a class="button secondary" href="${escapeHtml(link.url)}">${reportLinkLabel(link)}</a>`).join("")}
          </div>
        </section>
      `;
    }
    return "";
  }

  function renderProjectDetail() {
    const mount = document.querySelector("[data-project-detail]");
    if (!mount) return;

    const slug = new URLSearchParams(location.search).get("slug") || mount.dataset.projectSlug || listedProjects[0]?.slug;
    const project = projects.find((item) => item.slug === slug);
    if (!project) {
      mount.innerHTML = `
        <section class="section-pad page-intro">
          <div class="container narrow">
            <p class="eyebrow">Project not found</p>
            <h1>This project page does not exist yet.</h1>
            <p class="lede">Check the URL or return to the project gallery.</p>
            <a class="button primary" href="projects.html">Back to Projects</a>
          </div>
        </section>
      `;
      return;
    }

    document.title = `${project.title} | Rujie Cheng`;
    const description = document.querySelector('meta[name="description"]');
    if (description) description.setAttribute("content", project.summary);
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) ogTitle.setAttribute("content", `${project.title} | Rujie Cheng`);
    const ogDescription = document.querySelector('meta[property="og:description"]');
    if (ogDescription) ogDescription.setAttribute("content", project.summary);
    const ogImage = document.querySelector('meta[property="og:image"]');
    if (ogImage) ogImage.setAttribute("content", project.heroImage);

    const currentIndex = navigationProjects.findIndex((item) => item.slug === project.slug);
    const previous = currentIndex > 0 ? navigationProjects[currentIndex - 1] : null;
    const next = currentIndex >= 0 ? navigationProjects[currentIndex + 1] : null;

    mount.innerHTML = `
      <section class="case-hero section-pad">
        <div class="container">
          <a class="back-link" href="projects.html">&larr; Return to all projects</a>
          <div class="case-hero-grid">
            <div>
              <h1>${escapeHtml(project.title)}</h1>
              ${project.metaBeforeIntro ? projectMetaLine(project) : ""}
              ${project.showIntro === false ? "" : `<p class="lede case-intro">${projectIntro(project)}</p>`}
              ${project.contributionNote ? `<p class="case-contribution">${escapeHtml(project.contributionNote)}</p>` : ""}
              ${project.metaBeforeIntro ? "" : projectMetaLine(project)}
              ${focusAreas(project)}
              ${topLinks(project)}
            </div>
          </div>
        </div>
      </section>
      <div class="container case-body">
        ${project.showHeroImage === false ? "" : imageFigure({ image: project.heroImage, map: project.interactiveMap, alt: project.heroAlt, caption: project.heroCaption }, "hero-case-image")}
        ${(project.sections || []).map(renderSection).join("")}
        ${methodsAndData(project)}
      </div>
      <nav class="container project-nav" aria-label="Project navigation">
        ${previous ? `<a class="project-nav-previous" href="${projectUrl(previous)}"><span>Previous</span>${escapeHtml(previous.title)}</a>` : ""}
        ${next ? `<a class="project-nav-next" href="${projectUrl(next)}"><span>Next</span>${escapeHtml(next.title)}</a>` : ""}
      </nav>
    `;
  }

  renderProjectDetail();

  document.addEventListener("error", (event) => {
    const target = event.target;
    if (target instanceof HTMLImageElement && target.hasAttribute("data-fallback")) {
      target.removeAttribute("data-fallback");
      target.src = "public/images/site/image-placeholder.svg";
      target.alt = target.alt || "Placeholder image";
    }
  }, true);

  document.addEventListener("click", (event) => {
    const trigger = event.target.closest("[data-lightbox]");
    if (!trigger) return;
    const src = trigger.getAttribute("data-lightbox");
    const alt = trigger.querySelector("img")?.alt || "";
    const dialog = document.createElement("dialog");
    dialog.className = "lightbox";
    dialog.innerHTML = `
      <button type="button" class="lightbox-close" aria-label="Close image">Close</button>
      <img src="${escapeHtml(src)}" alt="${escapeHtml(alt)}">
    `;
    document.body.append(dialog);
    dialog.querySelector("button").addEventListener("click", () => dialog.close());
    dialog.addEventListener("close", () => dialog.remove());
    dialog.showModal();
  });
})();
