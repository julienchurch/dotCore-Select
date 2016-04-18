
var Select = (function(window) {
  'use strict';

  var SelectObserver = { 
                       selects: []
                       };

  SelectObserver.getOpenSelects = function() {
    openSelects = [];
    this.selects.forEach(function(sel) {
      if (sel.isOpen) {
        openSelects.push(sel);
      }
    })
    return openSelects;
  };

  var keyCodes = {
                   up   : 38
                 , down : 40
                 , space: 32
                 , enter: 13
                 , esc  : 27
                 };

  function OptionObject(nativeOption) {
    this.underlying = nativeOption;
    this.raw = document.createElement("li");
    this._init()
  }

  OptionObject.prototype._init = function() {
    this.raw.innerHTML = this.underlying.innerHTML;
    var underclass     = this.underlying.getAttribute("class"),
        undervalue     = this.underlying.getAttribute("value"),
        underselected  = this.underlying.getAttribute("selected");
    if (underclass) { this.raw.setAttribute("class", underclass); }
    if (undervalue) { this.raw.setAttribute("value", undervalue); }
    if (underselected !== null) { this.raw.setAttribute("selected", ""); }
  }

  Object.defineProperty(OptionObject.prototype, "value", {
    get: function() {
      return this.raw.getAttribute("value");
    },
    set: function(value) {
      this.raw.setAttribute("value", value)
    }
  })

  OptionObject.prototype.deselect = function() {
    this.raw.removeAttribute("selected");
  }

  OptionObject.prototype.select = function() {
    this.raw.setAttribute("selected", "");
  }

  function makeOptionsList(underlying) {
    var optionsList = [];
    toArr(underlying).forEach(function(underopt) {
      var opt = new OptionObject(underopt);
      optionsList.push(opt);
    })
    return optionsList;
  }

  function SelectObject(nativeSelect) {
    this.underlying   = nativeSelect;
    this.raw          = document.createElement("div");
    this.label        = document.createElement("span");
    this.dropdown     = document.createElement("ul");
    this.options      = makeOptionsList(this.underlying.querySelectorAll("option"));
    this.defaultLabel = this.options[0].raw.innerText;
    this._init();
  }

  Object.defineProperty(SelectObject.prototype, "selectedIndex", {
    get: function() {
      return this.underlying.selectedIndex;
    },
    set: function(idx) {
      this.underlying.selectedIndex = idx;
      this.purgeSelected();
      this.options[idx].select();
    }
  });

  SelectObject.prototype._init = function() {
    this._buildCustomSelectMarkup();
    this._addEventListeners();
  };

  SelectObject.prototype._buildCustomSelectMarkup = function() {
    var Coeur = this,
        underclass = this.underlying.getAttribute("class") || "";
    this.underlying.style.display = "none";
    this.raw.appendChild(this.label);
    this.raw.appendChild(this.dropdown);
    this.raw.setAttribute("class", underclass);
    this.raw.setAttribute("tabindex", "0")
    this.underlying.parentNode.insertBefore(this.raw, this.underlying);
    this.dropdown.setAttribute("data-core", "select-dropdown");
    this.raw.setAttribute("data-core", "select");
    toArr(this.options).forEach(function(opt) {
      opt.raw.setAttribute("data-core", "select-option");
      Coeur.dropdown.appendChild(opt.raw);
    });
    this.updateLabel();
  };

  SelectObject.prototype._addEventListeners = function() {
    var Coeur = this;

    toArr(this.options).forEach(function(opt, idx) {
      opt.raw.addEventListener("mouseup", function() {
        Coeur.selectedIndex = idx;
        Coeur.updateLabel();
      })
    })

    document.addEventListener("click", function(e) {
      if (e.target === Coeur.raw         || 
          isChildOf(e.target, Coeur.raw) && 
          Coeur.isClosed) {
        Coeur.toggle();
      } else if (Coeur.isOpen) {
        Coeur.toggle();
      }
    }, false);

    document.addEventListener("keydown", function(e) {
      if (document.activeElement === Coeur.raw && Coeur.isClosed) {
        console.log(e.keyCode);
        if (e.keyCode == keyCodes.down) {
          Coeur.toggle();
        }
      }
    })
  };

  SelectObject.prototype.purgeSelected = function() {
    var Coeur = this;
    toArr(this.options).forEach(function(opt) {
      opt.deselect();
    });
  };

  SelectObject.prototype.updateLabel = function() {
    var idx = this.underlying.selectedIndex;
    this.label.innerText = this.options[idx].raw.innerText;
  }

  SelectObject.prototype.getIndex = function(query) {
    var optArray = toArr(this.options),
        optIdx;
    for (var i = 0; i < optArray.length; i++) {
      if (query === optArray[i].raw) { optIdx = i; break; }
    }
    return optIdx ? optIdx : -1;
  };

  SelectObject.prototype.getIndexByValue = function(query) {
    // Returns the first instance of a value in the array
    var optArray = toArr(this.options),
        optIdx;
    for (var i = 0; i < optArray.length; i++) {
      if (query === optArray[i].value) { optIdx = i; break; }
    }
    return optIdx ? optIdx : -1;
  };

  SelectObject.prototype.open = function() {
    this.dropdown.setAttribute("open", "");
  };

  Object.defineProperty(SelectObject.prototype, "isOpen", {
    get: function() {
      return this.dropdown.getAttribute("open") === "";
    }
  })

  Object.defineProperty(SelectObject.prototype, "isClosed", {
    get: function() {
      return !this.isOpen;
    }
  })

  SelectObject.prototype.toggle = function() {
    if (this.isOpen) { 
      this.dropdown.removeAttribute("open");
    } else {
      this.dropdown.setAttribute("open", "");
    }
  }

  SelectObject.prototype.close = function() {
    this.dropdown.removeAttribute("open");
  }

  function Select(nativeSelect) {
    var select = new SelectObject(nativeSelect); 
    SelectObserver.selects.push(select);
    return select;
  } 
  return Select;
})(window);
