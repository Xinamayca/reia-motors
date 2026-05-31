// REIA Motors — Decap CMS Preview Template

function toTitleCase(str) {
  if (!str) return str;
  return str.toLowerCase().replace(/\b\w/g, function(c) { return c.toUpperCase(); });
}

var CarsPreview = createClass({
  render: function () {
    var entry = this.props.entry;
    var cars = entry.getIn(['data', 'cars']);
    if (!cars || !cars.toJS) return h('p', { className: 'empty' }, 'No cars yet.');
    cars = cars.toJS();

    return h('div', { className: 'preview-wrap' },
      h('div', { className: 'reorder-warning' },
        h('div', { className: 'reorder-warning-title' }, 'Important — read before editing'),
        h('div', { className: 'reorder-warning-body' },
          'If you drag a car to a new position, click ',
          h('strong', null, 'Publish'),
          ', then ',
          h('strong', null, 'reload this page'),
          ' before toggling Sold or changing any other field. Otherwise your edit may save to the wrong car.'
        )
      ),
      cars.map(function (car, i) {
        var img = car.images && car.images.length ? car.images[0] : null;
        var price = car.price ? Number(car.price).toLocaleString('en-US') : '—';
        var km = car.km ? Number(car.km).toLocaleString('en-US') + ' km' : '—';
        var meta = [car.body, car.fuel, car.trans, km].filter(Boolean).join(' · ');

        return h('div', { key: (car.id || '') + '|' + i, className: 'car-card' + (car.sold ? ' sold' : '') },
          h('div', { className: 'card-img-wrap' },
            img
              ? h('img', { src: img, className: 'card-img' })
              : h('div', { className: 'card-img-placeholder' }, ''),
            car.sold && h('span', { className: 'badge-sold' }, 'Sold'),
            car.featured && !car.sold && h('span', { className: 'badge-featured' }, 'Featured')
          ),
          h('div', { className: 'card-body' },
            h('div', { className: 'card-title' }, car.year + ' ' + toTitleCase(car.title || '')),
            h('div', { className: 'card-price' }, (car.currency || 'AWG') + ' ' + price),
            h('div', { className: 'card-meta' }, meta)
          )
        );
      })
    );
  }
});

CMS.registerPreviewTemplate('carsdata', CarsPreview);
CMS.registerPreviewStyle('/admin/preview.css');
