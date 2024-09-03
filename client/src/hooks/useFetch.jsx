import {useEffect, useState} from "react"

const API_KEY = import.meta.env.VITE_GIFFY_API

const useFetch = ({keyword})=>{
    const [gifUrl , setGifUrl] = useState("")

    const fetchGifs = async () => {
         try {
             const response = await fetch(`https://api.giphy.com/v1/gifs/search?api_key=${API_KEY}&q=${keyword.split(" ").join("")}&limit=1`)

             const {data} = await response.json()

             setGifUrl(data[0].images.downsized_medium.url)
         } catch (error) {
             setGifUrl("https://i.giphy.com/media/v1.Y2lkPTc5MGI3NjExdm44cW1wczV3cWQ5MmpiMjNjOHZubWdocGlhNDBmMXVhcmRiNm1wOCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/amrNGnZUeWhZC/giphy.gif")
         }
    }
    useEffect(()=>{
        if(keyword) fetchGifs();
    },[keyword])

    return gifUrl;
}

export default useFetch