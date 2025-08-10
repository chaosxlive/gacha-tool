async function main() {

  const RESULT_LIST = Array.from('ABCDEF');
  const APP_PREFIX = 'CHICKEN';
  const MAX_RESULT_COUNT = 10;

  const { imgBackground } = await loadAllRequiredImages();

  const eleAppLoading = document.getElementById('app-loading');
  const eleOverlapContainer = document.getElementById('overlap-container');
  const eleGachaFlash = document.getElementById('gacha-flash');
  const eleGachaResult = document.getElementById('gacha-result');
  const eleGachaResultWrapper = document.getElementById('result-wrapper');
  const eleOptionPanel = document.getElementById('option-panel');
  const eleStockController = document.getElementById('stock-controller');
  const eleMainApp = document.getElementById('main-app');
  const eleLogo = document.getElementById('logo');
  const eleGachaIdle = document.getElementById('gacha-idle');
  const eleGachaRolling = document.getElementById('gacha-rolling');
  const elesTypeButton = document.querySelectorAll('#type-box>.type-button');
  /** @type {Array<HTMLElement>} */
  const eleGachaResultBoxes = [];
  /** @type {Array<HTMLElement>} */
  const eleGachaResultBoxImgWrappers = [];
  /** @type {Array<HTMLImageElement>} */
  const eleGachaResultBoxImgs = [];
  /** @type {Array<HTMLElement>} */
  const eleStockRows = [];

  let activeType = 1;

  initResultBox();
  initOptions();

  registerListeners();
  adjustScreenSize();

  updateActiveType();

  toggleAppLoading();


  function rollGacha() {
    eleGachaIdle.hidden = true;
    eleGachaRolling.hidden = false;

    eleOverlapContainer.hidden = false;
    eleGachaFlash.hidden = false;

    requestAnimationFrame(() => {
      eleGachaFlash.classList.add('gacha-flash-animation');
    });

    setTimeout(() => {
      eleGachaFlash.classList.remove('gacha-flash-animation');
    }, 1_500);

    setTimeout(() => {
      eleGachaIdle.hidden = false;
      eleGachaRolling.hidden = true;

      eleGachaFlash.hidden = true;
      eleOverlapContainer.hidden = true;

      showResult();
    }, 2_500);

    console.log(`Roll Gacha: ${activeType}`);

    for (let i = 0; i < activeType; i++) {
      setResultTo(i, RESULT_LIST[Math.floor(Math.random() * RESULT_LIST.length)]);
    }

    function setResultTo(i, result) {
      eleGachaResultBoxImgs[i].src = `./assets/result-${result}.jpg`;
      eleGachaResultBoxImgWrappers[i].style.setProperty('--result-text', `"${result}"`);
    }
  }

  function initResultBox() {
    for (let i = 0; i < MAX_RESULT_COUNT; i++) {
      const eleGachaResultBox = document.createElement('div');
      eleGachaResultBox.classList.add('gacha-result');
      eleGachaResultBoxes.push(eleGachaResultBox);

      const eleGachaResultBoxImgWrapper = document.createElement('div');
      eleGachaResultBoxImgWrapper.classList.add('gacha-result-img-wrapper');
      eleGachaResultBoxImgWrappers.push(eleGachaResultBoxImgWrapper);

      const eleGachaResultBoxImg = document.createElement('img');
      eleGachaResultBoxImgs.push(eleGachaResultBoxImg);

      eleGachaResultBoxImgWrapper.appendChild(eleGachaResultBoxImg);
      eleGachaResultBox.appendChild(eleGachaResultBoxImgWrapper);
      eleGachaResultWrapper.appendChild(eleGachaResultBox);
    }
  }

  function initOptions() {
    for (let i = 0; i < RESULT_LIST.length; i++) {
      const result = RESULT_LIST[i];
      const eleStockRow = document.createElement('div');
      eleStockRow.classList.add('stock-row');
      eleStockRows.push(eleStockRow);
      const eleDecreaseButton = document.createElement('div');
      eleDecreaseButton.classList.add('decrease-button');
      eleDecreaseButton.textContent = '-';
      eleDecreaseButton.addEventListener('click', () => {
        // TODO
      });
      eleStockRow.appendChild(eleDecreaseButton);
      const eleAmount = document.createElement('div');
      eleAmount.classList.add('stock-amount');
      eleAmount.textContent = '0';
      eleStockRow.appendChild(eleAmount);
      const eleIncreaseButton = document.createElement('div');
      eleIncreaseButton.textContent = '+';
      eleIncreaseButton.classList.add('increase-button');
      eleIncreaseButton.addEventListener('click', () => {
        // TODO
      });
      eleStockRow.appendChild(eleIncreaseButton);
      eleStockController.appendChild(eleStockRow);
    }
  }

  function showResult() {
    eleGachaResultWrapper.classList.add(`type-${activeType}`);

    for (let i = 0; i < MAX_RESULT_COUNT; i++) {
      eleGachaResultBoxes[i].hidden = i >= activeType;
    }

    eleOverlapContainer.hidden = false;
    eleGachaResult.hidden = false;
  }

  function closeResult() {
    eleGachaResult.hidden = true;
    eleOverlapContainer.hidden = true;

    for (let i = 0; i < MAX_RESULT_COUNT; i++) {
      eleGachaResultBoxes[i].hidden = true;
    }

    eleGachaResultWrapper.classList.remove(`type-${activeType}`);
  }

  function updateActiveType() {
    Object.values(elesTypeButton)
      .forEach(ele => {
        ele.classList.toggle('active', ele.dataset.type === String(activeType));
      });
  }

  function adjustScreenSize() {
    const bodyRect = document.body.getBoundingClientRect();

    const imgBackgroundWidth = imgBackground.width;
    const imgBackgroundHeight = imgBackground.height;
    const imgBackgroundRatio = imgBackgroundWidth / imgBackgroundHeight;

    eleMainApp.style.aspectRatio = `${imgBackgroundWidth} / ${imgBackgroundHeight}`;

    if (bodyRect.height * imgBackgroundRatio > bodyRect.width) {
      eleMainApp.style.width = bodyRect.width + 'px';
      eleMainApp.style.height = null;
    } else {
      eleMainApp.style.width = null;
      eleMainApp.style.height = bodyRect.height + 'px';
    }

  }

  function registerListeners() {
    window.addEventListener('resize', () => {
      adjustScreenSize();
    });

    elesTypeButton.forEach(ele => {
      ele.addEventListener('click', () => {
        activeType = Number(ele.dataset.type);
        updateActiveType();
      });
    });

    eleGachaIdle.addEventListener('click', () => {
      rollGacha();
    });

    eleGachaResult.querySelector('.close').addEventListener('click', () => {
      closeResult();
    });

    eleLogo.addEventListener('click', () => {
      showOptionPanel();
    });

    eleOptionPanel.querySelector('.close').addEventListener('click', () => {
      closeOptionPanel();
    });
  }

  function showOptionPanel() {
    eleOverlapContainer.hidden = false;
    eleOptionPanel.hidden = false;
  }

  function closeOptionPanel() {
    eleOptionPanel.hidden = true;
    eleOverlapContainer.hidden = true;
  }

  function toggleAppLoading() {
    eleAppLoading.hidden = !eleAppLoading.hidden;
  }

  async function loadImage(path) {
    return new Promise(resolve => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.src = path;
    });
  }

  async function loadAllRequiredImages() {
    let logo;
    let background;
    let gachaIdle;
    let gachaRolling;
    let typeButton1;
    let typeButton5;
    let typeButton10;
    let results = [];

    await Promise.all([
      new Promise(async resolve => {
        logo = await loadImage('./assets/logo.png');
        resolve(logo);
      }),
      new Promise(async resolve => {
        background = await loadImage('./assets/background.png');
        resolve(background);
      }),
      new Promise(async resolve => {
        gachaIdle = await loadImage('./assets/gacha-idle.png');
        resolve(gachaIdle);
      }),
      new Promise(async resolve => {
        gachaRolling = await loadImage('./assets/gacha-rolling.png');
        resolve(gachaRolling);
      }),
      new Promise(async resolve => {
        typeButton1 = await loadImage('./assets/type-button-1.png');
        resolve(typeButton1);
      }),
      new Promise(async resolve => {
        typeButton5 = await loadImage('./assets/type-button-5.png');
        resolve(typeButton5);
      }),
      new Promise(async resolve => {
        typeButton10 = await loadImage('./assets/type-button-10.png');
        resolve(typeButton10);
      }),
      ...RESULT_LIST.map(r => new Promise(async resolve => {
        const img = await loadImage(`./assets/result-${r}.jpg`);
        results.push(img);
        resolve(img);
      }))
    ]);
    return {
      imgBackground: background,
      resultImages: results,
    };
  }

}

requestAnimationFrame(() => {
  main();
});

