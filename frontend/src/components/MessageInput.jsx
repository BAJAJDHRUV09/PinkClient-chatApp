import { useRef, useState } from "react"
import { useChatStore } from "../store/useChatStore";
import { X , Image ,Send} from "lucide-react";
import toast from "react-hot-toast";

export const MessageInput = () => {

    const [text,setText] = useState("");
    const [imagePreview,setImagePreview] = useState(null);
    const fileInputRef = useRef(null);
    const {sendMessage} = useChatStore();

    const handleImageChange = (event) => {
        const file = event.target.files[0];
        if(!file.type.startsWith("image/")){
            toast.error("Please select an image.")
            return;
        }
        const reader = new FileReader();
        reader.onloadend = () => {
            setImagePreview(reader.result);
        }
        reader.readAsDataURL(file);
    };

    const removeImage = () => {
        setImagePreview(null);
        if(fileInputRef.current) fileInputRef.current.value = "";

    };

    const handleSendMessage = async (event) =>{
        event.preventDefault();
        if(!text.trim()&& !imagePreview) return;
        
        //so now i try to send message and i have to use the sendMessage function in order to call the api
        try{
            await sendMessage({
                text: text.trim(),
                image: imagePreview,
            });

            //now if its sended now lets the clear message section
            setText("");
            setImagePreview(null);
            if(fileInputRef.current) fileInputRef.current.value = "";
        }catch(error){
            toast.error("Sorry an error occured.")
            console.log("Failed to send the message",error);
        }
    };

    return (
        <div className="p-4 w-full mt-auto">

         {/*first of all what i need is to build the above display for preview of image so this section contains that only.*/}
            {imagePreview && (
            <div className="mb-3 flex items-center gap-2">
                <div className="relative">
                    <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-20 h-20 object-cover rounded-lg border border-zinc-700"
                    />
                    <button
                    onClick={removeImage}
                    className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-base-300
                    flex items-center justify-center"
                    type="button"
                    >
                    <X className="size-3" />
                    </button>
                </div>
            </div> )}

        {/* now building form for messaging inputs which which will be text and handling image uploads.*/}

            <form onSubmit={handleSendMessage} className="flex items-center gap-2">
                <div className="flex-1 flex gap-2">

                    {/* for message input */}
                    <input 
                    type="text" 
                    placeholder="Type a message.."
                    className="w-full input input-bordered rounded-lg input-sm sm:input-md"
                    value={text}
                    onChange={(event) => setText(event.target.value)}
                    />
                    
                    {/* for file input */}
                    <input  
                    type="file"
                    accept="image/*"
                    className="hidden"
                    ref={fileInputRef}
                    onChange={handleImageChange}
                    />

                    {/* this button neccasary because to make the ui more attractive than traditional input buttons and it will call the above input when its clicked because that is the current reference for fileInputRef */}
                    <button
                    type="button"
                    className={`hidden sm:flex btn btn-circle ${imagePreview ? "text-emerald-500" : "text-zinc-400"}`}
                    onClick={() => fileInputRef.current?.click()}  
                    >
                    <Image size={20} />
                    </button>

                </div>
                {/* now we need to have the send buttton  */}
                <button
                type="submit"
                className="btn btn-sm btn-circle"
                disabled={!text.trim()&&!imagePreview}
                >
                <Send size={22} />
                </button>
            </form>
        
        </div>
    )
    
}
