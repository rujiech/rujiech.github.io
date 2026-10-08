/* Adapted from Final_Proj/script_clustered.js. Stored outputs remain authoritative. */
(function(root) {
  const strategies = [
    {id:'Screening-First',name:'Broad screening',model:'glmnet',predictors:'Reduced set',threshold:0.20,purpose:'Flags more potential exceedances.',tradeoff:'May also flag wells whose measurements do not exceed the study benchmark.'},
    {id:'Confirmation-First',name:'Focused screening',model:'Random Forest',predictors:'Full set',threshold:0.50,purpose:'Reduces false alarms.',tradeoff:'May miss more wells with measured exceedances.'},
    {id:'Explanation-First',name:'Simplified inputs',model:'Random Forest',predictors:'Reduced set',threshold:0.30,purpose:'Shows results from a model using fewer input factors.',tradeoff:''}
  ];
  const flagged = feature => feature.properties.status === 'Exceedance';
  const summarize = features => ({total:features.length,flagged:features.filter(flagged).length,share:features.length ? features.filter(flagged).length/features.length : null});
  const clusterColor = share => share >= .5 ? '#b42318' : share >= .2 ? '#d58b27' : '#50adb4';
  const clusterSize = n => Math.max(30,Math.min(60,24+Math.sqrt(n)*4));
  const api = {strategies,flagged,summarize,clusterColor,clusterSize};
  root.ArsenicCore = api;
  if(typeof module !== 'undefined') module.exports = api;
})(typeof window !== 'undefined' ? window : globalThis);
