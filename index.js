const http = require("http");
const express = require("express")
const app = express()
const bodyParser = require("body-parser")
const fs = require("fs")
const axios = require("axios");
const { v2 } = require("cloudinary");

v2.config({
    cloud_name: "dzcxy6zsg",
    api_key: "867754147488345",
    api_secret: "T1MK5A2gfcv6uJstue7yEtVVzX0"
})

app.use(bodyParser.urlencoded({ extended: true }))


async function uploadToCloudAndReturnUrl() {
    try {
        const uploadResult = await v2.uploader.upload("./images/last_image.jpg", {
            public_id: "ESP32CAM"
        }).catch(err => console.log(err));

        console.log(uploadResult)
        return uploadResult.url
    } catch (err) {
        console.log("Error in uploading image to cloud : ", err.message)
        return ""
    }
}



app.get("/getAudio", async (req, res) => {
    try {
        console.log("request received")
        let fileBlob = req.body.myFile;

        res.writeHead(200, { "Content-Type": "text/html" })
        if (createFile(fileBlob, "./images/last_image.jpg")) {
            res.write("Image uploaded successuflly");
            res.write("the image describes there is boy sitting infront of you");
        } else {
            res.write("Sorry boss! something went wrong")
        }

        let image_url = await uploadToCloudAndReturnUrl();
        console.log("image url : " + image_url)
        let image_desciption = await describeImage(image_url);
        console.log("Image caption : " + image_desciption)
        convertTextToAudio(image_desciption); // yet to complete by dhanush
    } catch (err) {
        console.log("Overall error : ",  err.message)
    }
    res.end()
})


function createFile(blob, fileName) {
    try {
        const base64Data = blob.split(';base64,').pop();
        const imageData = Buffer.from(base64Data, 'base64');
        fs.writeFileSync(fileName, imageData, (err) => {
            if (err) {
                throw err;
            }
            console.log('Image saved successfully!');
        });
        return true

    } catch (err) {
        console.log("error in creating file from blob : ", err.message)
        return false;
    }
}


async function describeImage(image_url) {
    try {

        const response = await axios.post("https://aivisionforiot.cognitiveservices.azure.com/computervision/imageanalysis:analyze", {
            url: image_url
        }, {
            headers: {
                'Content-Type': 'application/json',
                'Ocp-Apim-Subscription-Key': "e2f78fc133a04cc8b7419a410816ae90"
            },
            params: {
                'api-version': '2023-02-01-preview',
                'features': 'caption'
            }
        })

        const description = response.data.captionResult.text;

        return description
    } catch (err) {
        console.log("Error catched while describing image : " +  err.message)
        return "Sorry, something went wrong";
    }
}

function convertTextToAudio(textContent) {
    // convert the text to audio and save the mp3 in Audio/voice.mp3

}


// async function mp3ToBlob() {
//     const buffer = fs.readFileSync("./Audio/audio.mp3")
//     console.log(buffer.toString())
//     return buffer;
// }

// console.log(mp3ToBlob())



http.createServer(app).listen(3000, () => {
    console.log("Server is listening on port 3000")
});
