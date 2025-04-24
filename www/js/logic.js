// logic.js

const state = {};

document.addEventListener("DOMContentLoaded", () => {
  const savedState = JSON.parse(localStorage.getItem("engagementState") || "{}");

  // === Handle RESET button (checkboxes only)
  const resetButton = document.getElementById("reset-page");
  if (resetButton) {
    resetButton.addEventListener("click", () => {
      const checkboxes = document.querySelectorAll("input[type='checkbox']");
      checkboxes.forEach((checkbox) => {
        const id = checkbox.id;
        if (!id) return;
        checkbox.checked = false;
        state[id] = false;
      });
      saveState();
    });
  }

  // === Handle CHECKBOXES
  const checkboxes = document.querySelectorAll("input[type='checkbox']");
  checkboxes.forEach((checkbox) => {
    const id = checkbox.id;
    if (!id) return;
    if (savedState.hasOwnProperty(id)) {
      checkbox.checked = savedState[id];
    }
    state[id] = checkbox.checked;
    checkbox.addEventListener("change", (e) => {
      state[id] = e.target.checked;
      saveState();
    });
  });

  // === Handle SLIDERS
  const sliders = document.querySelectorAll("input[type='range']");
  sliders.forEach((slider) => {
    const id = slider.id;
    if (!id) return;
    if (savedState.hasOwnProperty(id)) {
      slider.value = savedState[id];
    }
    state[id] = slider.value;
    slider.addEventListener("input", (e) => {
      state[id] = e.target.value;
      saveState();
    });
  });

  // === Handle RADIO BUTTONS
  const radios = document.querySelectorAll("input[type='radio'][name='engagementStage']");
  radios.forEach((radio) => {
    const id = radio.id;
    if (!id) return;
    if (savedState.engagementStage === id) {
      radio.checked = true;
    }
    radio.addEventListener("change", () => {
      state.engagementStage = id;
      saveState();
    });
  });

  // === Show/hide result blocks based on checkboxes
  document.querySelectorAll(".result-block").forEach((block) => {
    const key = block.dataset.key;
    if (savedState[key] === true) {
      block.style.display = "none";
    } else {
      block.style.display = "block";
    }
  });

  // === Show only matching stage result (radio)
  document.querySelectorAll(".stage-result").forEach((section) => {
    if (section.dataset.stage === savedState.engagementStage) {
      section.style.display = "block";
    } else {
      section.style.display = "none";
    }
  });


  // === Submit button (shows next section within same page)
  const submitBtn = document.getElementById("submit-btn");
  if (submitBtn) {
    submitBtn.addEventListener("click", () => {
      const nextSection = document.getElementById("page1b");
      if (nextSection) fadeIn(nextSection);
      submitBtn.scrollIntoView({ behavior: "smooth", block: "end" });
    });
  }





  // === Next button (navigates to results.html with slide)
  const nextBtn = document.getElementById("next-btn");
  if (nextBtn) {
    nextBtn.addEventListener("click", () => {
      const currentPage = document.querySelector(".page");
      if (currentPage) {
        currentPage.classList.add("slide-out");
        setTimeout(() => {
          window.location.href = "results.html";
        }, 400);
      } else {
        window.location.href = "results.html";
      }
    });
  }
});

// === Save to localStorage
function saveState() {
  localStorage.setItem("engagementState", JSON.stringify(state));
}

// === Fade animations
function fadeIn(el, duration = 300) {
  el.style.opacity = 0;
  el.style.display = "block";
  let last = +new Date();
  const tick = function () {
    el.style.opacity = +el.style.opacity + (new Date() - last) / duration;
    last = +new Date();
    if (+el.style.opacity < 1) {
      window.requestAnimationFrame(tick);
    }
  };
  tick();
}

function fadeOut(el, duration = 300) {
  el.style.opacity = 1;
  let last = +new Date();
  const tick = function () {
    el.style.opacity = +el.style.opacity - (new Date() - last) / duration;
    last = +new Date();
    if (+el.style.opacity > 0) {
      window.requestAnimationFrame(tick);
    } else {
      el.style.display = "none";
    }
  };
  tick();
}

// === Utility (optional)
function goToPage(pageId) {
  const pages = document.querySelectorAll(".page");
  pages.forEach((p) => (p.style.display = "none"));
  const target = document.getElementById(pageId);
  if (target) fadeIn(target);
}

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js')
      .then(reg => {
        console.log('Service Worker registered with scope:', reg.scope);
      })
      .catch(err => {
        console.error('Service Worker registration failed:', err);
      });
  });
}
let deferredPrompt;

window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;

  const installBtn = document.getElementById('install-btn');
  if (installBtn) installBtn.style.display = 'block';

  installBtn.addEventListener('click', () => {
    deferredPrompt.prompt();
    deferredPrompt.userChoice.then((choiceResult) => {
      if (choiceResult.outcome === 'accepted') {
        console.log('User accepted the install');
      } else {
        console.log('User dismissed the install');
      }
      deferredPrompt = null;
    });
  });
});
