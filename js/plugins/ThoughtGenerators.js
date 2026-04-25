// ThoughtGenerators.js
(function() {
   
    
      // expose a single entry point
      window.applyThoughtGenerators = function() {
        attachMethods();
        // optional cleanup so you don't keep the global around
        delete window.applyThoughtGenerators;
      };
    
      // expose only apply, nothing else
      window.applyThoughtGenerators = apply;
    })();