import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { PiArrowFatUpLight, PiArrowFatDownLight, PiDotsThreeBold } from "react-icons/pi";
import Layout from "../components/Layout";
import DashboardHeader from "../components/DashboardHeader";
import SideNav from "../components/SidenNav";
import Button from "../components/Button";
import { config } from "../config";
import "../css/dashboard.css";

export default function Dashboard() {
  const navigate = useNavigate();

  const isLoggedIn = useSelector((state) => state.user.isLoggedIn);
  const userId = useSelector((state) => state.user.user_id);
  const [discussions, setDiscussions] = useState([]);
  const [fetching, setFetching] = useState(true);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isLoggedIn) navigate("/login");
  }, [isLoggedIn, navigate]);

  useEffect(() => {
    const endpoint = config.url;
    const fetchDiscussions = async () => {
      try {
        const response = await fetch(`${endpoint}/api/posts`);
        if (response.ok) {
          const data = await response.json();
          const discussionsWithUserAndComments = await Promise.all(
            data.map(async (discussion) => {
              const userResponse = await fetch(`${endpoint}/api/users`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ user_id: discussion.user_id }),
              });

              if (userResponse.ok) {
                const userData = await userResponse.json();
                discussion.user = userData;
              } else {
                console.error("Failed to fetch user:", userResponse);
              }

              const commentsResponse = await fetch(`${endpoint}/api/comments/${discussion.post_id}`);
              if (commentsResponse.ok) {
                const commentsData = await commentsResponse.json();
                const commentsWithUser = await Promise.all(
                  commentsData.map(async (comment) => {
                    const commentUserResponse = await fetch(`${endpoint}/api/users`, {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ user_id: comment.user_id }),
                    });

                    if (commentUserResponse.ok) {
                      const commentUserData = await commentUserResponse.json();
                      comment.user = commentUserData;
                    } else {
                      console.error("Failed to fetch user for comment:", commentUserResponse);
                    }

                    return comment;
                  })
                );
                discussion.comments = commentsWithUser;
              } else {
                console.error("Failed to fetch comments:", commentsResponse);
              }

              return discussion;
            })
          );

          setDiscussions(discussionsWithUserAndComments);
          setFetching(false);
        } else {
          console.error("Failed to fetch discussions:", response);
          setFetching(false);
        }
      } catch (error) {
        console.error("Error fetching discussions:", error);
        setFetching(false);
      }
    };

    fetchDiscussions();
  }, [isLoggedIn]);

  const addComment = async (e) => {
    setLoading(true);

    const content = e.target[0].value;
    const postId = e.target.getAttribute("post-key");

    const endpoint = config.url;
    try {
      const response = await fetch(`${endpoint}/api/comments/add`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ post_id: postId, user_id: userId, content }),
      });

      if (response.ok) {
        const data = await response.json();
        return data;
      } else {
        console.error("Failed to add comment:", response);
        return null;
      }
    } catch (error) {
      console.error("Error adding comment:", error);
      return null;
    } finally {
      setLoading(false);
    }
  };

  function allDiscussions() {
    if (discussions.length === 0) {
      return <p id="loadingText">No discussions available.</p>;
    }

    return (
      <div className="discussionsContainer">
        {discussions.map((discussion) => (
          <div key={discussion.post_id} className="discussionCard">
            <div className="discussionCardHeader">
              <div className="discussionCardHeaderLeft userCont">
                <p className="name">{discussion.user.firstName} {discussion.user.lastName}</p>
                <p className="date">{new Date(discussion.created_date).toLocaleString()}</p>
              </div>
              <div className="discussionCardHeaderRight">
                <button>
                  <PiDotsThreeBold size={24} color="#858585" />
                </button>
              </div>
            </div>
            <div className="discussionCardBody">
              <div className="bodyHeader">
                <h3>{discussion.title}</h3>
                <p>BCIT ISSP Class</p>
              </div>
              <p className="bodyContent">{discussion.content}</p>
            </div>
            <div className="voteCont">
              <button className="active">
                <PiArrowFatUpLight size={20} color="#858585" />
              </button>
              <p>{discussion.upvotes - discussion.downvotes}</p>
              <button>
                <PiArrowFatDownLight size={20} color="#858585" />
              </button>
            </div>
            <div className="discussionCardFooter">
              <h4>Comments <span>{discussion.comments.length}</span></h4>
              {(discussion.comments.length > 0 &&
                <div className="comments">
                  {discussion.comments.map((comment) => (
                    <div key={comment.comment_id} className="comment">
                      <div className="commentHeader">
                        <div className="commentHeaderLeft userCont">
                          <p className="name">{comment.user.firstName} {comment.user.lastName}</p>
                          <p className="date">{new Date(comment.created_date).toLocaleString()}</p>
                        </div>
                        <div className="commentHeaderRight voteCont">
                          <button>
                            <PiArrowFatUpLight size={20} color="#858585" />
                          </button>
                          <p>{comment.upvotes - comment.downvotes}</p>
                          <button>
                            <PiArrowFatDownLight size={20} color="#858585" />
                          </button>
                        </div>
                      </div>
                      <p className="content">{comment.content}</p>
                    </div>
                  ))}
                </div>
              )}
              <form post-key={discussion.post_id} className="addComment" onSubmit={addComment}>
                <input type="text" placeholder="Add a comment..." />
                <Button
                  type="submit"
                  title="Post"
                  loading={loading}
                  text="Post"
                />
              </form>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <Layout title="Dashboard">
      <DashboardHeader />
      <div className="dashboardContainer">
        {console.log(discussions)}
        <SideNav />
        <div>
          <div className="dashboardContent">
            <h2>Discussions</h2>
            <p className="description">
              Engage in lively community dialogues, share your insights, and forge
              connections with your neighbors as you delve into enriching
              conversations!
            </p>
          </div>
          {fetching ? <p id="loadingText">Loading...</p> : allDiscussions()}
        </div>
      </div>
    </Layout>
  );
}
