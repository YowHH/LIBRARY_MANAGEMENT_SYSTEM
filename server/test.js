import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
    cloud_name: "de5b4sd4n",
    api_key: "411541278695143",
    api_secret: "Di-cu_NYbsdoqCDxri-1falrGcs"
});

cloudinary.uploader.upload("https://res.cloudinary.com/demo/image/upload/sample.jpg")
    .then(res => console.log("✅ 上传成功:", res.secure_url))
    .catch(err => console.error("❌ 上传失败:", err));