# Font Face Observer

    var observer = new FontFaceObserver('My Family', {
      weight: 400
    });

    observer.check().then(function () {
      console.log('Font is available');
    }, function () {
      console.log('Font is not available');
    });

With custom test string:

    var observer = new FontFaceObserver('My Family', {});

    observer.check('hello').then(function () {
      console.log('Font is available');
    }, function () {
      console.log('Font is not available');
    });

