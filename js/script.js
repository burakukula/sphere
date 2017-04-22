const stage = document.querySelector('.stage');
const mapContainer = document.querySelector('.map-container');
const map = document.querySelector('.map');

class Dude {
    constructor(el) {
        this.stage = el.stage;
        this.mapContainer = el.mapContainer;
        this.map = el.map;
        this.stageWidth = this.stage.offsetWidth;
        this.stageWidthPercent = this.stageWidth/this.map.offsetWidth * 100;

        this.time = 20;
        this.mapWidth = 100;

        this.dudes;
        this.bubblesArray;

        this.attachEvents();
        this.mapContainer.addEventListener('animationiteration', (e) => {
          if(e.target !== this.mapContainer) {
            return;
          }

          this.bubblesArray.forEach((item) => {
            item.classList.remove('animated');
          });

          this.mapContainer.getBoundingClientRect();

          this.bubblesArray.forEach((item) => {
            item.classList.add('animated');
          });
        });
    }

    attachEvents() {
      this.setupMapItems();
      this.getGuys();
    }

    setupMapItems() {
      const clonedMap = this.map.cloneNode(true);
      this.mapContainer.append(clonedMap);
      const clonedDudes = clonedMap.querySelectorAll('.dude');
      const arrayCloned = Array.apply(null, clonedDudes);
      arrayCloned.forEach((item) => {
        const original = Number(item.getAttribute('data-time'));
        item.setAttribute('data-time', original + 100)
      });
      this.dudes = this.stage.querySelectorAll('.dude');
      this.bubblesArray = Array.apply(null, this.dudes);
    }

    getGuys() {
      this.bubblesArray.map((item) => {
        const position = Number(item.getAttribute('data-time'));
        this.calculateTiming(position, item);
      })
    }

    calculateTiming(el, item) {
      const positionPrimary = el;

      const stageHalfProcent = this.stageWidthPercent/2; //percent of the half of the stage
      const position = positionPrimary - stageHalfProcent;
      const whenToShow = position/this.mapWidth * this.time * 1000;

      item.style.animationDelay = whenToShow + 'ms';
    }

}

new Dude({stage, mapContainer, map});
