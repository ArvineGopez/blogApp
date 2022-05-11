import { withAuthenticator } from "@aws-amplify/ui-react";
import { useState , useRef, React } from "react";
import { API } from "aws-amplify"
import { v4 as uuid } from "uuid"
import { createPost } from "../src/graphql/mutations"
import { useRouter } from "next/router";
import dynamic from "next/dynamic";
import "easymde/dist/easymde.min.css";


const SimpleMDE = dynamic(() => import("react-simplemde-editor"), { ssr: false })
const initialState = { title: "", content:""}
function CreatePost (){
    
    const [ post, setPost] = useState(initialState);
    const { title, content } = post
    const router = useRouter();

    function onChange(e){
        setPost(() => ({
            ...post, [e.target.name]: e.target.value
        }))
    }

    async function createNewPost(){
        if (!title || !content) return;
        const id = uuid();
        post.id = id

        await API.graphql({
            query: createPost, 
            variables: { input: post},
            authMode: "AMAZON_COGNITO_USER_POOLS"
        })

        //router.push(`/post/${id}`)

    }
    return (
        <div>
            <h1 className="text-3xl font-semibold tracking-wide mt-6">Create new Post</h1>
            <input
                onChange = { onChange}
                name="title"
                placeholder="Title "
                value={post.title}
                className="border-b pb-2 text-lg my-4 focus:outline-none w=full font-light text-gray-500 placeholder-gray-500 y-2"
            />

            <SimpleMDE
            value={post.content}
            onChange={(value) => setPost({...post, content: value})}
            
            />
            <button type="button" 
            
            className="bg-blue-500 hover:bg-blue-700 
            text-white font-bold py-2 px-4 rounded-full"
            onClick={createNewPost}>
                Create a Post

            </button>
        </div>
    )
}



export default withAuthenticator(CreatePost);