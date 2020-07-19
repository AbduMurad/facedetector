let myvideo = document.querySelector('#myvideo');

Promise.all([
    faceapi.nets.tinyFaceDetector.loadFromUri('./models'),
    faceapi.nets.faceLandmark68Net.loadFromUri('./models'),
    faceapi.nets.faceRecognitionNet.loadFromUri('./models'),
    faceapi.nets.faceExpressionNet.loadFromUri('./models'),
])


// // one way to access the camera
// if (navigator.mediaDevices.getUserMedia) {
    //     navigator.mediaDevices.getUserMedia({video: true})
    //     .then(stream => myvideo.srcObject = stream)
    //     .catch(err => console.error('Something went wrong!', err))
    // }
    
    // // another way to access the camera
    const startVideo = () => {
        navigator.getUserMedia(
            {video: {} },
            stream => myvideo.srcObject = stream,
            err => console.error('Something went wrong!', err)
            )
        }
        
        
myvideo.addEventListener('play', () => {
    const canvas = faceapi.createCanvasFromMedia(myvideo)
    document.body.append(canvas)
    const displaySize = { width: myvideo.width, height: myvideo.height}
    faceapi.matchDimensions(canvas ,displaySize)
    setInterval (async () => {
        const detections = await faceapi.detectAllFaces(myvideo,
            new faceapi.TinyFaceDetectorOptions())
            .withFaceLandmarks()
            .withFaceExpressions()
        const resizedDetections = faceapi.resizeResults(detections, displaySize)
        canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height)
        faceapi.draw.drawDetections(canvas, resizedDetections)
        faceapi.draw.drawFaceExpressions(canvas, resizedDetections)
    }, 100)
})


startVideo();