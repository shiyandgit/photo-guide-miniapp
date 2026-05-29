Component({
  properties: {
    guide: {
      type: Object,
      value: {}
    }
  },

  methods: {
    onTap() {
      this.triggerEvent('tap', { id: this.data.guide._id })
    }
  }
});
