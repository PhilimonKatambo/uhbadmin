import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './css/new2.css';
import { faCancel, faCircleXmark, faComment, faFile, faFileCirclePlus, faGreaterThan, faImage, faPlus, faPlusCircle, faPodcast, faSign, faThumbsDown, faThumbsUp, faTrashCan, faUpload, faWarning } from '@fortawesome/free-solid-svg-icons';
import { useEffect, useState } from 'react';
import { LeftSideBar } from './dashboard';
import Dialog from './dialog';
import Zoom from "react-medium-image-zoom";
import 'react-medium-image-zoom/dist/styles.css';
import ShareButtons from './share';

const NewsPage = () => {
    const [checkOverlay, setOverlay] = useState(false)
    const [news, setNews] = useState([])
    const [news2, setNews2] = useState([])
    const [allNews, setAllNews] = useState([])
    const [category, setCategory] = useState("General")
    const [refresh, setRefresh] = useState([false])

    const [isOpen, setIsOpen] = useState(false);
    const [showDialog, setShowDialog] = useState(false);
    const [msg, setMessage] = useState([])

    const openDialog = () => {
        setShowDialog(true);
        setTimeout(() => setIsOpen(true), 10);
    };

    useEffect(() => {
        const getAllFiles = async () => {
            try {
                const response = await fetch('https://mongodb-5-7rnl.onrender.com/postserver/files', {
                    method: 'Get',
                });
                if (!response.ok) {
                    throw new Error("Failed to retrive news")
                }
                const data = await response.json();
                const sortedData = [...data].sort((a, b) =>
                    new Date(b.uploadDate) - new Date(a.uploadDate)
                );
                setNews(sortedData)
                setNews2(sortedData);
            } catch (e) {
                setMessage(["News Problem", "Failed to show news, try again later"])
                openDialog()
            }
        }

        getAllFiles();
    }, [refresh])

    useEffect(() => {
        if (category === "General") {
            setNews(news2);
        } else {
            const filtered = news2.filter(new1 => new1.metadata.category === category);
            setNews(filtered);
        }
    }, [category, news])


    const check = (main, sub) => {
        main = main.toLowerCase();
        sub = sub.toLowerCase();
        return [...sub].every(ch => main.includes(ch))
    }

    const autoFind = (e) => {
        const searchTerm = e.target.value.toLowerCase();

        const filtered = news2.filter(new1 => {
            const fullName = (new1.metadata.title).toLowerCase();
            return check(fullName, searchTerm);
        });

        setNews(filtered);
    }

    return (
        <div id='newsPage'>
            <LeftSideBar />
            {/* <ShareButtons /> */}
            {showDialog ? <Dialog msg={msg} isOpen={isOpen} showDialog={showDialog} setIsOpen={setIsOpen} setShowDialog={setShowDialog} /> : <div style={{ display: "none" }}></div>}
            <PostNews checkOverlay={checkOverlay} setOverlay={setOverlay} openDialog={openDialog} setMessage={setMessage} setRefresh={setRefresh} refresh={refresh} />
            <div id='bigNewCard'>
                <div id='categorieTitles'>
                    <div id='categoryLeft'>
                        <div id={category === "General" ? "general" : "categoryName"} onClick={() => setCategory("General")}>General</div>
                        <div id={category === "Events" ? "general" : "categoryName"} onClick={() => setCategory("Events")}>Events</div>
                        <div id={category === "Holidy" ? "general" : "categoryName"} onClick={() => setCategory("Holidy")}>Holidy</div>
                        <div id={category === "Tasks" ? "general" : "categoryName"} onClick={() => setCategory("Tasks")}>Tasks</div>
                        <div id={category === "Meetings" ? "general" : "categoryName"} onClick={() => setCategory("Meetings")}>Meetings</div>
                    </div>
                    <div id='categoryRight'>
                        <input type='text' placeholder='Search news title' id='imps2' onChange={autoFind}></input>
                        <button id='postNews' onClick={() => setOverlay(true)}>
                            <div>Post News</div>
                            <FontAwesomeIcon icon={faPlusCircle}></FontAwesomeIcon>
                        </button>
                    </div>
                </div>
                {
                    news.length > 0 ? <div id='allNews'>
                        {
                            news.map((post, index) => (
                                <NewsCards key={index} news={post} setRefresh={setRefresh} refresh={refresh} setMessage={setMessage} openDialog={openDialog} />
                            ))
                        }
                    </div> : <div id='noNews'>
                        <div id='loader2'></div>
                        <div id='loaderWord'> Loading news...</div>
                        <div id='loaderWord2'>
                            <FontAwesomeIcon icon={faWarning}></FontAwesomeIcon>
                            <div id='loaderW'>If it takes longer, please try again later!</div>
                        </div>
                    </div>
                }

            </div>
            {/* <Footer /> */}
        </div>
    )
}

const NewsCards = (props) => {
    const [checkOverlay, setOverlay] = useState(false);
    const [file, setImageUrl] = useState(null);
    const [vidsUrl, setVidsUrl] = useState(null);
    const [fileType, setFileType] = useState("");

    useEffect(() => {
        const handleFile = async () => {
            try {
                const response = await fetch(`https://mongodb-5-7rnl.onrender.com/postserver/files/${props.news.filename}`, {
                    method: "GET",
                });

                if (!response.ok) {
                    throw new Error(`Failed to fetch file: ${props.news.filename}`);
                }

                const contentType = response.headers.get("content-type");
                const blob = await response.blob();
                const url = URL.createObjectURL(blob);

                if (contentType.startsWith("image/")) {
                    setImageUrl(url);
                    setFileType("image");
                } else if (contentType.startsWith("video/")) {
                    setVidsUrl(url);
                    setFileType("video");
                } else {
                    setFileType("document");
                }
            } catch (e) { }
        };

        handleFile();
    }, [props.news.filename]);

    const news = props.news;
    const [like, setLike] = useState(false)
    const [dislike, setDislike] = useState(false)

    const updateReaction = async (reaction) => {
        const id = props.news._id
        try {
            const response = await fetch(`https://mongodb-5-7rnl.onrender.com/postserver/files/${id}/react`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    type: reaction,
                    like: like,
                    dislike: dislike
                })
            })

            const data = await response.json()
            if (!response.ok) {
                throw new Error(`Failed to like: ${file.post.filename}`);
            }
            if (reaction === "like") {
                setLike(true)
                setDislike(false)
                // setLikesCount((eval(likesCount) + 1).toString())
                // setDisLikesCount((eval(disLikesCount) - 1).toString())
                fetchReactions(id)
            } else {
                setDislike(true)
                setLike(false)
                // setLikesCount((eval(likesCount) - 1).toString())
                // setDisLikesCount((eval(disLikesCount) + 1).toString())
                fetchReactions(id)
            }
        } catch (e) {
            props.setMessage(["Failed react", "Can't react news"])
            props.openDialog()
        }
    }

    const deleteNews = async (id) => {
        try {
            //alert(id)
            const response = await fetch(`https://mongodb-5-7rnl.onrender.com/postserver/files/${id}`, {
                method: "DELETE"
            })
            if (!response.ok) {
                props.setMessage(["Failed delete", "Can't delete news"])
                props.openDialog()
            }
            props.setRefresh(prev => !prev);
        } catch (e) {
            props.setMessage(["Failed delete", "Can't delete news"])
            props.openDialog()
        }
    }

    const [reactions, setReactions] = useState({ likes: news.metadata.reactions.likes, dislikes: news.metadata.reactions.dislikes });
    const [loading, setLoading] = useState(true);

    const fetchReactions = async (Id) => {
        try {
            const res = await fetch(`https://mongodb-5-7rnl.onrender.com/postserver/files/${Id}/reactions`);
            if (!res.ok) throw new Error("Failed to fetch reactions");

            const data = await res.json();
            setReactions(data.reactions);
            setLoading(false);
        } catch (err) {
            console.error("Error fetching reactions:", err);
            setLoading(false);
        }
    };

    // useEffect(() => {
    //     fetchReactions(props.news._id);
    //     const interval = setInterval(fetchReactions, 5000); // refresh every 5s
    //     return () => clearInterval(interval);
    // }, [props.news._id]);


    return (
        <>
            {file ? (
                <div
                    id="newsCard3"
                    style={{
                        backgroundImage: file ? `url('${file}')` : "none",
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                    }}
                >
                    <div id='newsCardUp'>
                        <div id='upIn' onClick={() => deleteNews(news._id)}>
                            <FontAwesomeIcon icon={faTrashCan} id='deleteNews'></FontAwesomeIcon>
                        </div>
                    </div>
                    <ReadNews checkOverlay={checkOverlay} setOverlay={setOverlay} news={props.news} file={file} fileType={fileType} updateReaction={updateReaction} deleteNews={deleteNews} reactions={reactions} like={like} dislike={dislike} setLike={setLike} setDislike={setDislike} />
                    <div id="newsMore2">
                        <div id="newsTitle2">
                            <div>{news.metadata.title}</div>
                            <div id='uploadDate'>{new Date(news.uploadDate).toLocaleString()}</div>
                        </div>
                        <div id="newsContent">
                            <div id="shortNews2">{news.metadata.description}</div>
                            <div id="reacts">
                                <div id="reactions">
                                    <button id="like" onClick={() => { updateReaction("like") }} disabled={like}>
                                        <div>{reactions.likes}</div>
                                        <FontAwesomeIcon icon={faThumbsUp} />
                                    </button>
                                    <button id="like" onClick={() => updateReaction("dislike")} disabled={dislike}>
                                        <div>{reactions.dislikes}</div>
                                        <FontAwesomeIcon icon={faThumbsDown} />
                                    </button>

                                    {/* <div id="like">
                                        <div>500</div>
                                        <FontAwesomeIcon icon={faComment} />
                                    </div> */}
                                </div>
                                <div id="newsButtons">
                                    <button id="newsReadMore" onClick={() => setOverlay(true)}>
                                        <div id="read">Read more</div>
                                        <FontAwesomeIcon icon={faGreaterThan} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div id="vidxNewsdiv">
                    {vidsUrl ? (
                        <video id="vidxNews" src={vidsUrl} controls autoPlay muted />
                    ) : (
                        <div className="loader"></div>
                    )}
                    <ReadNews checkOverlay={checkOverlay} setOverlay={setOverlay} news={props.news} file={vidsUrl} fileType={fileType} updateReaction={updateReaction} deleteNews={deleteNews} reactions={reactions} like={like} dislike={dislike} setLike={setLike} setDislike={setDislike} />
                    <div id="newsMore3">
                        <div id="newsTitle3">{news.metadata.title}</div>
                        <div id="newsContent">
                            <div id="shortN">{news.metadata.description}</div>
                            <div id="reacts">
                                <div id="reactions">
                                    <button id="like2" onClick={() => updateReaction("like")} disabled={like}>
                                        <div>{reactions.likes}</div>
                                        <FontAwesomeIcon icon={faThumbsUp} />
                                    </button>
                                    <button id="like2" onClick={() => updateReaction("dislike")} disabled={dislike}>
                                        <div>{reactions.likes.dislikes}</div>
                                        <FontAwesomeIcon icon={faThumbsDown} />
                                    </button>

                                    <div id='upIn' onClick={() => deleteNews(news._id)}>
                                        <FontAwesomeIcon icon={faTrashCan} id='deleteNews'></FontAwesomeIcon>
                                    </div>
                                    {/* <div id="like2">
                                        <div>500</div>
                                        <FontAwesomeIcon icon={faComment} />
                                    </div> */}
                                </div>
                                <div id="newsButtons">
                                    <button id="newsRead2" onClick={() => setOverlay(true)}>
                                        <div id="read">more</div>
                                        <FontAwesomeIcon icon={faGreaterThan} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};


const ReadNews = (props) => {
    const news = props.news;
    return (
        <div id='newOverlay' style={{ display: props.checkOverlay ? "flex" : "none" }} >
            <div id='postingContents'>
                <div id='readTitle'>{news.metadata.title}</div>
                <div id='readFile'>
                    {
                        props.file ? <Zoom>
                            {props.fileType === "video" ? <video src={`${props.file}`} id='vidsRead' controls autoPlay muted></video> : <img src={`${props.file}`} id='imageUrl'></img>}
                        </Zoom> : <div id='loaderWord2'>
                            <FontAwesomeIcon icon={faWarning}></FontAwesomeIcon>
                            <div id='loaderW'>No any video or image to show</div>
                        </div>
                    }
                </div>

                <div id='reacts2'>
                    <div id='reactions2'>
                        <button id='like2' onClick={() => {
                            props.updateReaction("like")
                            props.setLike(true)
                        }} disabled={props.like}>
                            <div>{props.reactions.likes}</div>
                            <FontAwesomeIcon icon={faThumbsUp}></FontAwesomeIcon>
                        </button>
                        <button id='like2' onClick={() => {
                            props.updateReaction("dislike")
                            props.setDislike(true)
                        }} disabled={props.dislike}>
                            <div>{props.reactions.dislikes}</div>
                            <FontAwesomeIcon icon={faThumbsDown}></FontAwesomeIcon>
                        </button>
                        <div id='upIn' onClick={() => props.deleteNews(news._id)}>
                            <FontAwesomeIcon icon={faTrashCan} id='deleteNews'></FontAwesomeIcon>
                        </div>
                    </div>
                </div>

                <div id='shortNews3'>
                    {news.metadata.description}
                </div>
            </div>
            <FontAwesomeIcon icon={faCircleXmark} id='cancel' onClick={() => { props.setOverlay(false) }}></FontAwesomeIcon>
        </div>
    )
}

const PostNews = (props) => {
    const [fileName, setFileName] = useState();
    const [checkSubmit, setCheckSubmit] = useState(false);
    const [fileType, setFileType] = useState();
    const [enable, setEnable] = useState(false);

    const changeName = (e) => {
        const file = e.target.files[0];
        setFileName(file ? file.name : "");

        const container = document.getElementById("showFile");
        container.innerHTML = "";
        if (file) {
            if (file.type.startsWith("image/")) {
                const image = document.createElement("img");
                image.src = URL.createObjectURL(file);
                image.style.width = "200px";
                image.style.height = "200px";
                image.style.objectFit = "cover";
                container.appendChild(image);
            } else if (file.type.startsWith("video/")) {
                const video = document.createElement("video");
                video.src = URL.createObjectURL(file);
                video.controls = true;
                video.muted = true;
                video.autoplay = true;
                video.style.maxWidth = "100%";
                container.appendChild(video);
            }
        }
    };

    const upload = async () => {
        const inputElement = document.getElementById(fileType === "file" ? "getFile" : "getMedia");
        const file = inputElement ? inputElement.files[0] : null;
        const description = document.getElementById("postInp").value;
        const category = document.getElementById("catNames").value;
        const title = document.getElementById("newsTt").value;

        if (!file || !description || !title) {
            props.setMessage(["Fill all", "Fill title and description and any file or media"]);
            props.openDialog();
        } else {
            setCheckSubmit(true);
            const formData = new FormData();
            formData.append("uploader", "Philimon");
            formData.append("uploaderId", "Philimon123");
            formData.append("title", title);
            formData.append("description", description);
            formData.append("category", category);
            formData.append("file", file);

            try {
                const response = await fetch("https://mongodb-5-7rnl.onrender.com/postserver/upload", {
                    method: "POST",
                    body: formData,
                });

                if (!response.ok) throw new Error("Upload failed");

                const result = await response.json();

                if (!result.file) throw new Error("File not uploaded");

                setCheckSubmit(false);
                props.setOverlay(false);
                props.setMessage(["Post success", "Posted successfully"]);
                props.openDialog();
                props.setRefresh(!props.refresh);
            } catch (error) {
                setCheckSubmit(false);
                props.setOverlay(false);
                props.setMessage(["Post unsuccessful", "Not posted!, Unsuccessful!"]);
                props.openDialog();
            }
        }
    };

    return (
        <div id="newOverlay" style={{ display: props.checkOverlay ? "flex" : "none" }}>
            <div id="postingContents">
                <div id="postTitle">Post news</div>
                <div id="postDown">
                    <div>
                        <label htmlFor="catNames">Select news category</label>
                        <select id="catNames" name="cars">
                            <option>General</option>
                            <option>Events</option>
                            <option>Holidy</option>
                            <option>Tasks</option>
                            <option>Meetings</option>
                        </select>
                    </div>
                    <input
                        type="text"
                        placeholder="News title"
                        id="newsTt"
                        onChange={(e) => setEnable(e.target.value.length > 0)}
                    />
                    <textarea id="postInp" placeholder="Share news"></textarea>
                    <div id="filepart">
                        <div id="fileShow">
                            <label htmlFor="getFile">
                                <FontAwesomeIcon icon={faFileCirclePlus} id="filesFont" />
                            </label>
                            <input
                                onChange={(e) => {
                                    setFileType("file");
                                    changeName(e);
                                }}
                                type="file"
                                id="getFile"
                                style={{ display: "none" }}
                                accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.rtf,.odt"
                            />
                            <label htmlFor="getMedia">
                                <FontAwesomeIcon icon={faImage} id="filesFont" />
                            </label>
                            <input
                                onChange={(e) => {
                                    setFileType("media");
                                    changeName(e);
                                }}
                                type="file"
                                id="getMedia"
                                style={{ display: "none" }}
                                accept="image/*,video/*"
                            />
                        </div>
                        <div id="showFile"></div>
                        <div>{fileName}</div>
                    </div>
                    <div id="postButts">
                        {enable ? (
                            <button id="readMore" onClick={upload}>
                                {checkSubmit ? <div>Posting...</div> : <div>Post</div>}
                                {checkSubmit ? <div className="loader"></div> : <FontAwesomeIcon icon={faUpload} />}
                            </button>
                        ) : (
                            <button id="readLess">
                                <div>Post</div>
                                <FontAwesomeIcon icon={faUpload} />
                            </button>
                        )}
                    </div>
                </div>
            </div>
            <FontAwesomeIcon icon={faCircleXmark} id="cancel" onClick={() => props.setOverlay(false)} />
        </div>
    );
};
export default NewsPage