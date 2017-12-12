// When the DOM is ready
$(function() {

    // Init ScrollMagic Controller
    var scrollMagicController = new ScrollMagic();

    // Animation will be ignored and replaced by scene value in this example
    var tween = TweenMax.to('#animation', 0.5, {
        backgroundColor: 'rgb(255, 39, 46)',
        scale: 5,
        rotation: 360
    });

    // Create the Scene and trigger when visible
    var scene = new ScrollMagic.Scene({
        triggerElement: '#scene',
        duration: 300 /* How many pixels to scroll / animate */
    })
        .setTween(tween)
        .addTo(scrollMagicController);

    // Add debug indicators fixed on right side
    scene.addIndicators();

});