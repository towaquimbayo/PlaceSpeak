import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { PiArrowFatUpLight, PiArrowFatDownLight, PiDotsThreeBold } from "react-icons/pi";
import { MdVerified } from "react-icons/md";
import Select from "react-select";
import Layout from "../components/Layout";
import DashboardHeader from "../components/DashboardHeader";
import SideNav from "../components/SideNav";
import Button from "../components/Button";
import { config } from "../config";
import "../css/dashboard.css";
import { ConfettiModal } from "../components/ConfettiModal";
export default function Dashboard() {
  const navigate = useNavigate();

  const { isLoggedIn, user_id, firstName, pfp_link } = useSelector((state) => state.user);
  const [discussions, setDiscussions] = useState([]);
  const [fetching, setFetching] = useState(true);
  const [loading, setLoading] = useState(false);
  const [expandedDiscussionId, setExpandedDiscussionId] = useState(null);
  const [unlockedBadge, setUnlockedBadge] = useState(false);
  const [unlockedBadgeMessage, setUnlockedBadgeMessage] = useState("");

  useEffect(() => {
    if (!isLoggedIn) navigate("/login");
  }, [isLoggedIn, navigate]);

  useEffect(() => {
    const endpoint = config.url;

    const fetchUser = async (userId) => {
      try {
        const response = await fetch(`${endpoint}/api/users`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ user_id: userId }),
        });

        if (response.ok) {
          return await response.json();
        } else {
          throw new Error(`Failed to fetch user: ${response.status}`);
        }
      } catch (error) {
        console.error("Error fetching user:", error);
        return null;
      }
    };

    const fetchComments = async (postId) => {
      try {
        const response = await fetch(`${endpoint}/api/comments/${postId}`);

        if (response.ok) {
          const commentsData = await response.json();
          const commentsWithUser = await Promise.all(
            commentsData.map(async (comment) => {
              const user = await fetchUser(comment.user_id);
              return { ...comment, user };
            })
          );
          return commentsWithUser;
        } else {
          throw new Error(`Failed to fetch comments: ${response.status}`);
        }
      } catch (error) {
        console.error("Error fetching comments:", error);
        return [];
      }
    };

    const fetchDiscussions = async () => {
      try {
        const response = await fetch(`${endpoint}/api/posts`);

        if (response.ok) {
          const data = await response.json();
          const discussionsWithUserAndComments = await Promise.all(
            data.map(async (discussion) => {
              const user = await fetchUser(discussion.user_id);
              const comments = await fetchComments(discussion.post_id);
              return { ...discussion, user, comments };
            })
          );

          setDiscussions(discussionsWithUserAndComments);
          setFetching(false);
        } else {
          throw new Error(`Failed to fetch discussions: ${response.status}`);
        }
      } catch (error) {
        console.error("Error fetching discussions:", error);
        setFetching(false);
      }
    };

    fetchDiscussions();
  }, [isLoggedIn]);

  const addDiscussion = async (e) => {
    e.preventDefault();
    setLoading(true);

    const title = e.target[0].value;
    const content = e.target[1].value;

    let responseText = "";

    const endpoint = config.url;
    try {
      const response = await fetch(`${endpoint}/api/posts/add`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: user_id, title, content }),
      });

      if (response.ok) {
        const data = await response.json();
        responseText += data;
      } else {
        console.error("Failed to add discussion:", response);
        return null;
      }
    } catch (error) {
      console.error("Error adding discussion:", error);
      return null;
    } finally {
      setLoading(false);
    }

    try {
      const badgeResponse = await fetch(`${endpoint}/api/${user_id}/verify-new-neighbor/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      if (badgeResponse.ok) {
        const badgeData = await badgeResponse.json();
        responseText += badgeData;
        if (badgeData.badge_granted) {
          setUnlockedBadge(true);
          setUnlockedBadgeMessage("You just unlocked the New Neighbour Badge!");
          // Wait 3 seconds before hiding the badge message, then refresh the page
          setTimeout(() => {
            setUnlockedBadge(false);
            setUnlockedBadgeMessage("");
            window.location.reload();
          }, 3000);
        } else {
          window.location.reload();
        }
        return responseText;
      } else {
        console.error("Failed to verify new neighbor badge:", badgeResponse);
        return null;
      }
    } catch (error) {
      console.error("Error verifying new neighbor badge:", error);
      return null;
    }
  };

  const addComment = async (e) => {
    e.preventDefault();
    setLoading(true);

    const content = e.target[0].value;
    const postId = e.target.getAttribute("post-key");

    const endpoint = config.url;

    let responseText = "";
    try {
      const response = await fetch(`${endpoint}/api/comments/add`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ post_id: postId, user_id: user_id, content }),
      });

      if (response.ok) {
        responseText += await response.json();
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

    try {
      const badgeResponse = await fetch(`${endpoint}/api/${user_id}/verify-new-neighbor/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      if (badgeResponse.ok) {
        const badgeData = await badgeResponse.json();
        responseText += badgeData;
        if (badgeData.badge_granted) {
          setUnlockedBadge(true);
          setUnlockedBadgeMessage("You just unlocked the New Neighbour Badge!");
          // Wait 3 seconds before hiding the badge message, then refresh the page
          setTimeout(() => {
            setUnlockedBadge(false);
            setUnlockedBadgeMessage("");
            window.location.reload();
          }, 3000);
        } else {
          window.location.reload();
        }
        return responseText;
      } else {
        console.error("Failed to verify new neighbor badge:", badgeResponse);
        return null;
      }
    } catch (error) {
      console.error("Error verifying new neighbor badge:", error);
      return null;
    }
  };

  const UserInfo = ({ user }) => {
    const [badges, setBadges] = useState([]);

    useEffect(() => {
      const fetchBadges = async () => {
        try {
          const response = await fetch(`${config.url}/api/badges`);
          if (response.ok) {
            const badgesData = await response.json();
            const userBadges = badgesData.filter((badge) => badge.users.includes(user.id));
            setBadges(userBadges);
          } else {
            throw new Error(`Failed to fetch badges: ${response.status}`);
          }
        } catch (error) {
          console.error("Error fetching badges:", error);
        }
      };

      fetchBadges();
    }, [user.id]);

    return (
      <div className="userInfo">
        <div className="userHead">
          <img
            src={user.pfp_link || `https://api.dicebear.com/8.x/bottts-neutral/svg?seed=${user.firstName}`}
            alt="avatar"
            width={46}
          />
          <div className="userHeadRight">
            <p className="name">
              {user.firstName} {user.lastName}
              {(user.verified_email && user.verified_phone && user.verified_address) && <MdVerified color="white" size={16} />}
            </p>
            <p className="about">{user.about}</p>
          </div>
        </div>
        {badges.length > 0 && (
          <div className="userBadges">
            {badges.map((badge) => (
              <img key={badge.badge_id} src={`./img/badges/${badge.name}.svg`} alt={badge.name} width={30} />
            ))}
          </div>
        )}
        <div className="userContact">
          <p className="contact email">{user.email}</p>
          <p className="contact phone">{user.phone}</p>
        </div>
      </div>
    );
  };

  const toggleComments = (discussionId) => {
    setExpandedDiscussionId((prevId) => (prevId === discussionId ? null : discussionId));
  };

  function allDiscussions() {
    if (discussions.length === 0) {
      return <p id="loadingText">No discussions available.</p>;
    }

    return (
      <div className="discussionsContainer">
        {discussions
          .sort((a, b) => new Date(b.created_date) - new Date(a.created_date))
          .map((discussion) => (
            <div key={discussion.post_id} className="discussionCard">
              <div className="discussionCardHeader">
                <div className="discussionCardHeaderLeft">
                  <img
                    src={discussion.user.pfp_link || `https://api.dicebear.com/8.x/bottts-neutral/svg?seed=${discussion.user.firstName}`}
                    alt="avatar"
                    width={38}
                  />
                </div>
                <div className="discussionCardHeaderCenter userCont">
                  <p className="name">
                    {discussion.user.firstName} {discussion.user.lastName}
                    <UserInfo user={discussion.user} />
                  </p>
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
                <h4 onClick={() => toggleComments(discussion.post_id)}>
                  Comments <span>{discussion.comments.length}</span>
                </h4>
                {expandedDiscussionId === discussion.post_id && (
                  <>
                    {(discussion.comments.length > 0 &&
                      <div className="comments">
                        {discussion.comments.map((comment) => (
                          <div key={comment.comment_id} className="comment">
                            <div className="commentHeader">
                              <div className="commentHeaderLeft">
                                <img
                                  src={comment.user.pfp_link || `https://api.dicebear.com/8.x/bottts-neutral/svg?seed=${comment.user.firstName}`}
                                  alt="avatar"
                                  width={38}
                                />
                              </div>
                              <div className="commentHeaderCenter userCont">
                                <p className="name">
                                  {comment.user.firstName} {comment.user.lastName}
                                  <UserInfo user={comment.user} />
                                </p>
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
                  </>
                )}
              </div>
            </div>
          ))}
      </div>
    );
  }

  return (
    <Layout title="Dashboard">
      <ConfettiModal isOpen={unlockedBadge} message={unlockedBadgeMessage} />
                
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
          <form className="addDiscussion" onSubmit={addDiscussion}>
            <div className="formHead">
              <img
                src={pfp_link || `https://api.dicebear.com/8.x/bottts-neutral/svg?seed=${firstName}`}
                alt="avatar"
                width={38}
              />
              <input type="text" placeholder="Start a new discussion..." />
              <Select
                options={[{
                  value: "1",
                  label: "BCIT ISSP Class",
                }]}
                name="Topic"
                styles={{
                  control: (styles) => ({
                    ...styles,
                    width: "100%",
                    height: "100%",
                    border: "none",
                    boxShadow: "none",
                    backgroundColor: "#F5F5F5",
                    borderRadius: "0.5rem",
                  }),
                  option: (styles) => ({
                    ...styles,
                    fontSize: "0.85rem",
                    fontWeight: "400",
                    lineHeight: "1.25rem",
                    paddingLeft: "0.375rem",
                    transition: "background-color 0.3s ease-in-out",
                  }),
                  placeholder: (styles) => ({
                    ...styles,
                    fontSize: "0.85rem",
                    fontWeight: "400",
                    lineHeight: "1.25rem",
                    paddingLeft: "0.375rem",
                  }),
                  singleValue: (styles) => ({
                    ...styles,
                    fontSize: "0.85rem",
                    fontWeight: "400",
                    lineHeight: "1.25rem",
                    paddingLeft: "0.375rem",
                  }),
                }}
                placeholder="Select topic..."
                onChange={() => { }}
              />
            </div>
            <textarea placeholder={`What's the discussion about, ${firstName}?`} rows={4} />
            <div>
              <Button
                type="submit"
                title="Create New Discussion"
                loading={loading}
                text="Create New Discussion"
              />
            </div>
          </form>
          {fetching ? <p id="loadingText">Loading...</p> : allDiscussions()}
        </div>
      </div>
    </Layout>
  );
}
