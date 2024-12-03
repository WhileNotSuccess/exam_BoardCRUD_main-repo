import React, { ChangeEvent, useState } from 'react'

const ImageUpload = () => {
    const [img, setImg] = useState<File|null>(null)
    const [url,setUrl] = useState<string>()
    const onclick = async () => {
        const formData = new FormData()
        if(!img){
            return
        }
        formData.append('image',img)
        const response = await fetch('http://localhost:3012/s3/image-upload',{
            method:'POST',
            body:formData
        })
        if(response.ok){
          const json = await response.json()
          setUrl(json.url)
        }
    }
    console.log(url)
  return (
    <div>
      <input type="file" onChange={(e:ChangeEvent<HTMLInputElement>)=>{
        if(e.target.files){
            setImg(e.target.files[0])
        }
        }}/>
        <button onClick={onclick}>전송</button>
        {url?<img src={`${url}`} alt="img..." />:'img'}
    </div>
  )
}

export default ImageUpload
