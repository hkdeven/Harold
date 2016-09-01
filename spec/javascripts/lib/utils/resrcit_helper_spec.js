define([ "public/assets/javascripts/lib/utils/resrcit_helper.js" ], function(ResrcIt) {

  "use strict";

  describe("ResrcIt Helper", function() {

    var sample_url = "http://images-resrc.staticlp.com/S=W1000/http://media.lonelyplanet.com/assets/sloth.jpg",
        to_copy_to = [
          "http://media.lonelyplanet.com/assets/a-better-sloth.jpg",
          "http://media.lonelyplanet.com/assets/an-even-better-sloth.jpg"
        ];

    it("returns the service url", function() {
      expect(ResrcIt.get(sample_url)).toBe("http://images-resrc.staticlp.com/S=W1000/");
    });

    it("returns the image url with the service url stripped out.", function() {
      expect(ResrcIt.strip(sample_url)).toBe("http://media.lonelyplanet.com/assets/sloth.jpg");
      expect(ResrcIt.strip(to_copy_to[0])).toBe("http://media.lonelyplanet.com/assets/a-better-sloth.jpg");
    });

    it("copies the service url from one url to others.", function() {
      var updated = ResrcIt.copy(sample_url, to_copy_to);

      expect(updated[0]).toBe("http://images-resrc.staticlp.com/S=W1000/http://media.lonelyplanet.com/assets/a-better-sloth.jpg");
      expect(updated[1]).toBe("http://images-resrc.staticlp.com/S=W1000/http://media.lonelyplanet.com/assets/an-even-better-sloth.jpg");
    });

    it("is able to makes the resize landscape/portrait.", function() {
      var portrait_url = ResrcIt.bestFit(sample_url, "PORTRAIT");

      // to Portrait/Vertical
      expect(portrait_url).toBe("http://images-resrc.staticlp.com/S=H1000/http://media.lonelyplanet.com/assets/sloth.jpg");
      expect(ResrcIt.bestFit(sample_url, "VERTICAL")).toBe("http://images-resrc.staticlp.com/S=H1000/http://media.lonelyplanet.com/assets/sloth.jpg");

      // to Landscape/Horizontal
      expect(ResrcIt.bestFit(portrait_url, "LANDSCAPE")).toBe("http://images-resrc.staticlp.com/S=W1000/http://media.lonelyplanet.com/assets/sloth.jpg");
      expect(ResrcIt.bestFit(portrait_url, "HORIZONTAL")).toBe("http://images-resrc.staticlp.com/S=W1000/http://media.lonelyplanet.com/assets/sloth.jpg");
    });

  });

});
