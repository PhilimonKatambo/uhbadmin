import React, { useState } from "react";

const SendEmail = () => {
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [users, setUsers] = useState([
    { name: "", email: "" }
  ]);
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState("");

  const handleUserChange = (index, field, value) => {
    const updated = [...users];
    updated[index][field] = value;
    setUsers(updated);
  };

  const addUser = () => {
    setUsers([...users, { name: "", email: "" }]);
  };

  const removeUser = (index) => {
    const updated = users.filter((_, i) => i !== index);
    setUsers(updated);
  };

  const sendEmails = async (e) => {
    e.preventDefault();
    setLoading(true);
    setFeedback("");

    try {
      const response = await fetch("https://mongodb-5-7rnl.onrender.com/sendEmail/send-emails", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subject, message, users })
      });

      const data = await response.json();
      if (response.ok) {
        setFeedback("✅ Emails sent successfully!");
      } else {
        setFeedback("❌ Failed to send: " + (data.error || "Unknown error"));
      }
    } catch (err) {
      setFeedback("⚠️ Network or server error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>📧 Send Emails</h2>

      <form onSubmit={sendEmails} style={styles.form}>
        <input
          type="text"
          placeholder="Email subject"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          style={styles.input}
          required
        />

        <textarea
          placeholder="Write your message here..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          style={styles.textarea}
          required
        />

        <h4 style={{ marginTop: "10px" }}>Recipients:</h4>
        {users.map((user, index) => (
          <div key={index} style={styles.userRow}>
            <input
              type="text"
              placeholder="Name"
              value={user.name}
              onChange={(e) => handleUserChange(index, "name", e.target.value)}
              style={{ ...styles.input, flex: 1 }}
              required
            />
            <input
              type="email"
              placeholder="Email"
              value={user.email}
              onChange={(e) => handleUserChange(index, "email", e.target.value)}
              style={{ ...styles.input, flex: 1 }}
              required
            />
            <button
              type="button"
              onClick={() => removeUser(index)}
              style={styles.removeBtn}
            >
              ✖
            </button>
          </div>
        ))}

        <button type="button" onClick={addUser} style={styles.addBtn}>
          ➕ Add Recipient
        </button>

        <button type="submit" disabled={loading} style={styles.sendBtn}>
          {loading ? "Sending..." : "Send Emails"}
        </button>
      </form>

      {feedback && <div style={styles.feedback}>{feedback}</div>}
    </div>
  );
};


const styles = {
  container: {
    maxWidth: "600px",
    margin: "50px auto",
    background: "#fff",
    padding: "20px",
    borderRadius: "10px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
    fontFamily: "Arial, sans-serif"
  },
  title: {
    textAlign: "center",
    color: "#007bff"
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "10px"
  },
  input: {
    padding: "10px",
    fontSize: "16px",
    border: "1px solid #ccc",
    borderRadius: "5px"
  },
  textarea: {
    padding: "10px",
    fontSize: "16px",
    minHeight: "100px",
    borderRadius: "5px",
    border: "1px solid #ccc",
    resize: "vertical"
  },
  userRow: {
    display: "flex",
    gap: "5px",
    alignItems: "center"
  },
  addBtn: {
    padding: "8px",
    background: "#28a745",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer"
  },
  sendBtn: {
    padding: "10px",
    background: "#007bff",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer"
  },
  removeBtn: {
    background: "red",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    padding: "8px 10px"
  },
  feedback: {
    marginTop: "15px",
    textAlign: "center",
    fontWeight: "bold"
  }
};

export default SendEmail;
