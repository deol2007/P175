AFRAME.registerComponent("city", {
  init: async function () {
    var compounds = await this.getCompounds();

    var barcodes = Object.keys(compounds);

    barcodes.map((barcode) => {
      var model = compounds[barcode];

      this.createModel(model);
    });
  },
  getCompounds: function () {
    return fetch("js/compoundList.json")
      .then((res) => res.json())
      .then((data) => data);
  },

  createModel: function (model) {
    var barcodeValue = model.barcode_value;
    var modelUrl = model.model_url;
    var modelName = model.model_name

    var scene = document.querySelector("a-scene");

    var marker = document.createElement("a-marker");

    marker.setAttribute("id", `marker-${barcodeValue}`);
    marker.setAttribute("type", "barcode");
    marker.setAttribute("model_name", modelName);
    marker.setAttribute("value", barcodeValue);
    marker.setAttribute("markerhandler", {});
    scene.appendChild(marker);

    var part = document.createElement("a-entity");
    part.setAttribute("id", `${partName}-${barcodeValue}`);
    marker.appendChild(atom);

    var card = document.createElement("a-entity");
    card.setAttribute("id", `card-${partName}`);
    card.setAttribute("geometry", {
      primitive: "plane",
      width: 1,
      height: 1,
    });

    card.setAttribute("material", {
      src: `./assets/part_cards/card_${partName}.png`,
    });
    card.setAttribute("position", { x: 0, y: 0, z: 0 });
    card.setAttribute("rotation", { x: -90, y: 0, z: 0 });

    part.appendChild(card);

    var item = document.createElement("a-entity");
}
})