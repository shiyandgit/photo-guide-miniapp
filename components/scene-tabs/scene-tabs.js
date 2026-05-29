Component({
  properties: {
    scenes: {
      type: Array,
      value: []
    },
    selected: {
      type: String,
      value: ''
    }
  },

  methods: {
    select(e) {
      const scene = e.currentTarget.dataset.scene;
      this.triggerEvent('select', { scene });
    }
  }
});
