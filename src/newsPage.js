import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './css/new2.css';
import { faCancel, faCircleXmark, faComment, faFile, faFileCirclePlus, faGreaterThan, faImage, faPlus, faPlusCircle, faPodcast, faSign, faThumbsDown, faThumbsUp, faUpload, faWarning } from '@fortawesome/free-solid-svg-icons';
import { useEffect, useState } from 'react';
import { LeftSideBar } from './dashboard';
import Dialog from './dialog';

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
                const response = await fetch('http://localhost:8000/files', {
                    method: 'Get',
                });
                if (!response.ok) {
                    throw new Error("Failed to retrive news")
                }
                const data = await response.json();
                setNews(data);
                setNews2(data);
            } catch (e) {
                setMessage(["News Problem", "Failed to show news, try again later"])
                openDialog()
            }
        }

        getAllFiles();
    }, [refresh])

    useEffect(() => {
        const filtered = news2.filter(new1 => new1.metadata.category === category);
        setNews(filtered);
    }, [category, news2]);


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
            {showDialog ? <Dialog msg={msg} isOpen={isOpen} showDialog={showDialog} setIsOpen={setIsOpen} setShowDialog={setShowDialog} /> : <div style={{ display: "none" }}></div>}
            <PostNews checkOverlay={checkOverlay} setOverlay={setOverlay} openDialog={openDialog} setMessage={setMessage} setRefresh={setRefresh} refresh={refresh} />
            <div id='bigNewCard'>
                <div id='categorieTitles'>
                    <div id='categoryLeft'>
                        <div id={category==="General"?"general":"categoryName"} onClick={() => setCategory("General")}>General</div>
                        <div id={category==="Events"?"general":"categoryName"} onClick={() => setCategory("Events")}>Events</div>
                        <div id={category==="Holidy"?"general":"categoryName"} onClick={() => setCategory("Holidy")}>Holidy</div>
                        <div id={category==="Tasks"?"general":"categoryName"} onClick={() => setCategory("Tasks")}>Tasks</div>
                        <div id={category==="Meetings"?"general":"categoryName"} onClick={() => setCategory("Meetings")}>Meetings</div>
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
                                <NewsCards key={index} news={post} />
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
    const [vidsUrl, setVidsUrl] = useState(null)
    const [fileType, setFileType] = useState("")

    useEffect(() => {
        const handleFile = async () => {
            try {
                const response = await fetch(`http://localhost:8000/files/${props.news.filename}`, {
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
                    setFileType("image")
                } else if (contentType.startsWith("video/")) {
                    setVidsUrl(url)
                    setFileType("video")
                } else {
                    setFileType("document")
                }

            } catch (e) {
                //console.log("Error: ", e.message);
                //alert(`Failed to handle file: ${props.news.filename}`);
            }
        };

        handleFile();
    }, [props.news.filename]);

    const news = props.news;
    return (
        <>
            {
                fileType === "image" ? <div
                    id="newsCard3"
                    style={{
                        backgroundImage: file ? `url('${file}')` : "none",
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                    }}
                >
                    <ReadNews checkOverlay={checkOverlay} setOverlay={setOverlay} news={props.news} file={file} />
                    <div id="newsMore2">
                        <div id="newsTitle2">{news.metadata.title}</div>
                        <div id="newsContent">
                            <div id="shortNews2">{news.metadata.description}</div>
                            <div id="reacts">
                                <div id="reactions">
                                    <div id="like">
                                        <div>25</div>
                                        <FontAwesomeIcon icon={faThumbsUp}></FontAwesomeIcon>
                                    </div>
                                    <div id="like">
                                        <div>100</div>
                                        <FontAwesomeIcon icon={faThumbsDown}></FontAwesomeIcon>
                                    </div>
                                    <div id="like">
                                        <div>500</div>
                                        <FontAwesomeIcon icon={faComment}></FontAwesomeIcon>
                                    </div>
                                </div>
                                <div id="newsButtons">
                                    <button id="newsReadMore" onClick={() => setOverlay(true)}>
                                        <div id="read">Read more</div>
                                        <FontAwesomeIcon icon={faGreaterThan}></FontAwesomeIcon>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div> : <div id='vidxNewsdiv'>
                    {vidsUrl ? <video id='vidxNews' src={vidsUrl} controls autoPlay muted></video> : <div className='loader'></div>}
                    <ReadNews checkOverlay={checkOverlay} setOverlay={setOverlay} news={props.news} file={file} />
                    <div id="newsMore3">
                        <div id="newsTitle3">{news.title}</div>
                        <div id="newsContent">
                            <div id="shortN">{news.metadata.description}</div>
                            <div id="reacts">
                                <div id="reactions">
                                    <div id="like2">
                                        <div>25</div>
                                        <FontAwesomeIcon icon={faThumbsUp}></FontAwesomeIcon>
                                    </div>
                                    <div id="like2">
                                        <div>100</div>
                                        <FontAwesomeIcon icon={faThumbsDown}></FontAwesomeIcon>
                                    </div>
                                    <div id="like2">
                                        <div>500</div>
                                        <FontAwesomeIcon icon={faComment}></FontAwesomeIcon>
                                    </div>
                                </div>
                                <div id="newsButtons">
                                    <button id="newsRead2" onClick={() => setOverlay(true)}>
                                        <div id="read">more</div>
                                        <FontAwesomeIcon icon={faGreaterThan}></FontAwesomeIcon>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            }
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
                        props.file ? <img src={`${props.file}`} id='imageUrl'></img> : <div>No image</div>
                    }
                </div>

                <div id='reacts2'>
                    <div id='reactions2'>
                        <div id='like2'>
                            <div>25</div>
                            <FontAwesomeIcon icon={faThumbsUp}></FontAwesomeIcon>
                        </div>
                        <div id='like2'>
                            <div>100</div>
                            <FontAwesomeIcon icon={faThumbsDown}></FontAwesomeIcon>
                        </div>
                        <div id='like2'>
                            <div>500</div>
                            <FontAwesomeIcon icon={faComment}></FontAwesomeIcon>
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
    const [checkSubmit, setCheckSubmit] = useState(false)
    const [fileType, setFileType] = useState()
    const [enable, setEnable] = useState(false)

    const changeName = (e) => {
        const file = e.target.files[0];
        setFileName(file.name);

        const container = document.getElementById("showFile");
        container.innerHTML = "";
        if (file) {
            const container = document.getElementById("showFile");

            if (file.type.startsWith("image/")) {
                const image = document.createElement('img');
                image.src = URL.createObjectURL(file);
                image.style.Width = "200px";
                image.style.height = "200px"
                image.style.objectFit = "cover"
                container.appendChild(image);

            } else if (file.type.startsWith("video/")) {
                const video = document.createElement('video');
                video.src = URL.createObjectURL(file);
                video.controls = true;
                video.muted = true;
                video.autoplay = true;
                video.style.maxWidth = "100%";
                container.appendChild(video);
            }
        }
    }
    const upload = async () => {
        const file = document.getElementById(fileType === "file" ? "getFile" : "getMedia").files[0];
        const description = document.getElementById('postInp').value;
        const category = document.getElementById('catNames').value;
        const title = document.getElementById('newsTt').value;

        if (!file || !description) {
            props.setMessage(["Fill all", "Fill title and description and any image"])
            props.openDialog()
        } else {
            setCheckSubmit(true);
            const formData = new FormData();
            formData.append('uploader', "Philimon");
            formData.append('uploaderId', "Philimon123");
            formData.append('title', title);
            formData.append('description', description);
            formData.append("category", category)
            formData.append('file', file);

            try {
                const response = await fetch('http://localhost:8000/upload', {
                    method: 'POST',
                    body: formData,
                });

                const result = await response.json();

                setCheckSubmit(false);
                props.setOverlay(false)
                props.setMessage(["Post success", "Posted successfully"])
                props.openDialog()
                props.setRefresh(!props.refresh)
            } catch (error) {
                props.setOverlay(false)
                props.setMessage(["Post unsuccessful", "Not posted successfully"])
                props.openDialog()
                setCheckSubmit(false);
            }
        }
    }

    return (
        <div id='newOverlay' style={{ display: props.checkOverlay ? "flex" : "none" }} >
            <div id='postingContents'>
                <div id='postTitle'>Post news</div>
                <div id='postDown'>
                    <div>
                        <label htmlFor="cars">Select news category</label>
                        <select id="catNames" name="cars">
                            <option>General</option>
                            <option>Events</option>
                            <option>Holidy</option>
                            <option>Tasks</option>
                            <option>Meetings</option>
                        </select>
                    </div>
                    <input type='text' placeholder='News title' id='newsTt' onChange={(e) => e.target.value.length > 0 ? setEnable(true) : setEnable(false)}></input>
                    <textarea type='text' id='postInp' placeholder='Share news'>
                    </textarea>
                    <div id='filepart'>
                        <div id='fileShow'>
                            <label htmlFor='getFile'><FontAwesomeIcon icon={faFileCirclePlus} id='filesFont'></FontAwesomeIcon></label>
                            <input onChange={(e) => { setFileType("file"); changeName(e); }} type='file' id='getFile' style={{ display: "none" }} accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.rtf,.odt"></input>
                            <label htmlFor='getMedia'><FontAwesomeIcon icon={faImage} id='filesFont'></FontAwesomeIcon></label>
                            <input onChange={(e) => { setFileType("media"); changeName(e) }} type='file' id='getMedia' style={{ display: "none" }} accept="image/*,video/*"></input>
                        </div>
                        <div id='showFile'></div>
                        <div>{fileName}</div>
                    </div>
                    <div id='postButts'>
                        {enable ? <button id='readMore' onClick={() => upload()}>
                            {checkSubmit ? <div>Posting...</div> : <div>Post</div>}
                            {checkSubmit ? <div class='loader'></div> : <FontAwesomeIcon icon={faUpload}></FontAwesomeIcon>}
                        </button> :
                            <button id='readLess'>
                                <div>Post</div>
                                <FontAwesomeIcon icon={faUpload}></FontAwesomeIcon>
                            </button>
                        }
                    </div>
                </div>
            </div>
            <FontAwesomeIcon icon={faCircleXmark} id='cancel' onClick={() => { props.setOverlay(false) }}></FontAwesomeIcon>
        </div>
    )
}

export default NewsPage