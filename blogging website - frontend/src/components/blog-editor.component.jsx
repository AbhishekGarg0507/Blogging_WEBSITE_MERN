import { Link } from "react-router-dom";
import logo from "../imgs/logo.png";
import AnimationWrapper from "../common/page-animation";
import defaultBanner from "../imgs/blogbanner.png";


const BlogEditor  = () => {

    const handleBannerUpload = (e) => {
       
        let image = e.target.files[0];
        
        
    }

    return (
        <>
            <nav className="navbar">
            <Link to="/" className=" flex-none w-10">
                <img src={logo} />
            </Link>

            <p className="max-md:hidden text-black line-clamp-1 w-full">
                new Blog
            </p>

            <div className="flex gap-4 ml-auto ">
                <button className="btn-dark py-2">
                    Publish
                </button>
                <button className="btn-light py-2">
                    Save Draft
                </button>
            </div>
            </nav>

            {/*banner for the editor page  */}
            <AnimationWrapper>
                <div className="mx-auto max-w-[900px] w-full">

                    <div className="relative aspect-video bg-white border-4 border-grey hover:opacity-80">

                        <label htmlFor="uploadBanner">
                            
                            <img 
                                src={defaultBanner}
                                className="z-20" 

                            />

                            <input 
                                id="uploadBanner"
                                type="file"
                                accept=".png, .jpg, .jpeg"
                                hidden 
                                onChange={handleBannerUpload}
                            />

                        </label>
                    </div>
                </div>
            </AnimationWrapper>
        </>
    )
}

export default BlogEditor;