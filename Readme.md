1. input = text,number,radio-button,select => req.body
2. input = files (image) => req.files

### how to upload a image into database and store it into cloudinary

    we need three(3) files > server.js, app.js, controller.js, userModelSchema.js

1. userModelSchema.js   
    ```const userSchema = new Schema({
            image: {
                public_id: {
                    type:String,
                    required: true,
                },
                url:{
                    type: String,
                    required: true,
                }
            }
        }) ```
2. server.js => set up your cloudinary
   1. ```

    2. controller.js
     ``` const { image } = req.files;


````
