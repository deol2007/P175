var partArray = [];

AFRAME.registerComponent("markerhandler", {
  init: async function () {
    var compounds = await this.getCompounds();

    this.el.addEventListener("markerFound", () => {
      var partName = this.el.getAttribute("part_name");
      var barcodeValue = this.el.getAttribute("value");
      partArray.push({
        part_name: partName,
        barcode_value: barcodeValue,
      });

      compounds[barcodeValue]["compounds"].map((item) => {
        var compound = document.querySelector(
          `#${item.compound_name}-${barcodeValue}`
        );
        compound.setAttribute("visible", false);
      });

      var atom = document.querySelector(`#${partName}-${barcodeValue}`);
      atom.setAttribute("visible", true);
    });

    this.el.addEventListener("markerLost", () => {
      var partName = this.el.getAttribute("part_name");
      var index = partArray.findIndex(
        (x) => x.part_name === partName
      );
      if (index > -1) {
        partArray.splice(index, 1);
      }
    });
  },

  tick: function () {
    if (partArray.length > 1) {
      var messageText = document.querySelector("#message-text");

      var length = partArray.length;
      var distance = null;

      var compound = this.getCompound();

      if (length === 2) {
        var marker1 = document.querySelector(
          `#marker-${partArray[0].barcode_value}`
        );
        var marker2 = document.querySelector(
          `#marker-${partArray[1].barcode_value}`
        );

        distance = this.getDistance(marker1, marker2);

        if (distance < 1.25) {
          if (compound !== undefined) {
            this.showCompound(compound);
          } else {
            messageText.setAttribute("visible", true);
          }
        } else {
          messageText.setAttribute("visible", false);
        }
      }

      if (length === 3) {
        var marker1 = document.querySelector(
          `#marker-${partArray[0].barcode_value}`
        );

        var marker2 = document.querySelector(
          `#marker-${partArray[1].barcode_value}`
        );

        var marker3 = document.querySelector(
          `#marker-${partArray[2].barcode_value}`
        );

        var distance1 = this.getDistance(marker1, marker2);
        var distance2 = this.getDistance(marker1, marker3);

        if (distance1 < 1.25 && distance2 < 1.25) {
          if (compound !== undefined) {
            var barcodeValue = partArray[0].barcode_value;
            this.showCompound(compound, barcodeValue);
          } else {
            messageText.setAttribute("visible", true);
          }
        } else {
          messageText.setAttribute("visible", false);
        }
      }
    }
  },
  getDistance: function (elA, elB) {
    return elA.object3D.position.distanceTo(elB.object3D.position);
  },
  countOccurrences: function (arr, val) {
    return arr.reduce((a, v) => (v.part_name === val ? a + 1 : a), 0);
  },
  getCompound: function () {
    for (var el of partArray) {
      if (A.includes(el.part_name)) {
        var compound = el.part_name;
        for (var i of partArray) {
          if (B.includes(i.part_name)) {
            compound += i.epart_name;
            return { name: compound, value: el.barcode_value };
          }
          if (C.includes(i.part_name)) {
            var count = this.countOccurrences(partArray, el.part_name);
            if (count > 1) {
              compound += count + i.part_name;
              return { name: compound, value: i.barcode_value };
            }
          }
        }
      }
    }
  },
  showCompound: function (compound) {
    partArray.map((item) => {
      var el = document.querySelector(
        `#${item.part_name}-${item.barcode_value}`
      );
      el.setAttribute("visible", false);
    });
    var compound = document.querySelector(
      `#${compound.name}-${compound.value}`
    );
    compound.setAttribute("visible", true);
  },
  getCompounds: function () {
    return fetch("js/compoundList.json")
      .then((res) => res.json())
      .then((data) => data);
  },
});
