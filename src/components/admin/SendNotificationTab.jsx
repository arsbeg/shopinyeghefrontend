import React, { useState } from "react";
import api from "../../api/axios";
import { useAuth } from "../../context/AuthContext";

export default function SendNotification() {
  const { token } = useAuth();

  // =========================
  // State
  // =========================
  const [groupId, setGroupId] = useState("");
  const [notification, setNotification] = useState("");
  const [notificationArm, setNotificationArm] = useState("");
  const [sending, setSending] = useState(false);

  // =========================
  // Notification groups
  // =========================
  const groups = [
    {
      id: 2,
      name: "Couriers",
    },
    {
      id: 3,
      name: "Managers",
    },
    {
      id: 4,
      name: "Users",
    },
  ];

  // =========================
  // Send notification
  // =========================
  const handleSend = async () => {
    // Check group
    if (!groupId) {
      alert("Please select a group");
      return;
    }

    // Check English message
    if (!notification.trim()) {
      alert("Please enter the English notification");
      return;
    }

    // Check Armenian message
    if (!notificationArm.trim()) {
      alert("Please enter the Armenian notification");
      return;
    }

    // Confirm before sending
    const selectedGroup = groups.find(
      (group) => group.id === Number(groupId)
    );

    const confirmed = window.confirm(
      `Send this notification to ${selectedGroup?.name || "selected group"}?`
    );

    if (!confirmed) {
      return;
    }

    try {
      setSending(true);

      const res = await api.post(
        `/Notifications/send_note/${groupId}`,
        {
          notification: notification.trim(),
          notification_arm: notificationArm.trim(),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Notification response:", res.data);

      alert("Notification sent successfully! 🔔");

      // Clear form
      setGroupId("");
      setNotification("");
      setNotificationArm("");
    } catch (err) {
      console.error("Error sending notification:", err);

      if (err.response) {
        console.error("Backend response:", err.response.data);

        alert(
          err.response.data?.message ||
            "Failed to send notification"
        );
      } else {
        alert("Failed to send notification");
      }
    } finally {
      setSending(false);
    }
  };

  // =========================
  // Cancel / clear form
  // =========================
  const handleClear = () => {
    setGroupId("");
    setNotification("");
    setNotificationArm("");
  };

  // =========================
  // Selected group
  // =========================
  const selectedGroup = groups.find(
    (group) => group.id === Number(groupId)
  );

  // =========================
  // JSX
  // =========================
  return (
    <div className="w-full px-3 md:px-6 py-4 md:py-6">
      <div className="max-w-3xl mx-auto">

        {/* =========================
            Header
        ========================= */}
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
            🔔 Send Notification
          </h1>

          <p className="text-sm md:text-base text-gray-500 mt-1">
            Send a notification to couriers, managers, or users.
          </p>
        </div>

        {/* =========================
            Main Card
        ========================= */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">

          {/* =========================
              Card Header
          ========================= */}
          <div className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 p-[2px] rounded-xl">
            <div className="bg-white px-5 md:px-7 py-5 rounded-xl">

              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white text-xl shadow-md">
                  🔔
                </div>

                <div>
                  <h2 className="font-bold text-lg text-gray-800">
                    New Notification
                  </h2>

                  <p className="text-sm text-gray-500">
                    Create and send a message
                  </p>
                </div>
              </div>

            </div>
          </div>

          {/* =========================
              Form
          ========================= */}
          <div className="p-5 md:p-7">

            {/* =========================
                Group Select
            ========================= */}
            <div className="mb-6">

              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Send to
              </label>

              <select
                value={groupId}
                onChange={(e) => setGroupId(e.target.value)}
                disabled={sending}
                className="
                  w-full
                  border border-gray-300
                  rounded-xl
                  px-4 py-3
                  bg-white
                  text-gray-700
                  outline-none
                  transition
                  focus:ring-2
                  focus:ring-purple-400
                  focus:border-purple-400
                  disabled:bg-gray-100
                  disabled:cursor-not-allowed
                "
              >
                <option value="">
                  Select group...
                </option>

                {groups.map((group) => (
                  <option
                    key={group.id}
                    value={group.id}
                  >
                    {group.name}
                  </option>
                ))}
              </select>

              {/* Selected group info */}
              {selectedGroup && (
                <div className="mt-2 text-sm text-purple-600">
                  Notification will be sent to{" "}
                  <span className="font-semibold">
                    {selectedGroup.name}
                  </span>
                </div>
              )}
            </div>

            {/* =========================
                English Notification
            ========================= */}
            <div className="mb-6">

              <label className="block text-sm font-semibold text-gray-700 mb-2">
                English notification
              </label>

              <textarea
                value={notification}
                onChange={(e) =>
                  setNotification(e.target.value)
                }
                disabled={sending}
                placeholder="Enter notification in English..."
                rows={5}
                maxLength={1000}
                className="
                  w-full
                  border border-gray-300
                  rounded-xl
                  px-4 py-3
                  text-gray-700
                  placeholder-gray-400
                  outline-none
                  resize-none
                  transition
                  focus:ring-2
                  focus:ring-blue-400
                  focus:border-blue-400
                  disabled:bg-gray-100
                  disabled:cursor-not-allowed
                "
              />

              <div className="flex justify-end mt-1">
                <span className="text-xs text-gray-400">
                  {notification.length}/1000
                </span>
              </div>

            </div>

            {/* =========================
                Armenian Notification
            ========================= */}
            <div className="mb-7">

              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Armenian notification
              </label>

              <textarea
                value={notificationArm}
                onChange={(e) =>
                  setNotificationArm(e.target.value)
                }
                disabled={sending}
                placeholder="Մուտքագրեք հաղորդագրությունը հայերեն..."
                rows={5}
                maxLength={1000}
                className="
                  w-full
                  border border-gray-300
                  rounded-xl
                  px-4 py-3
                  text-gray-700
                  placeholder-gray-400
                  outline-none
                  resize-none
                  transition
                  focus:ring-2
                  focus:ring-purple-400
                  focus:border-purple-400
                  disabled:bg-gray-100
                  disabled:cursor-not-allowed
                "
              />

              <div className="flex justify-end mt-1">
                <span className="text-xs text-gray-400">
                  {notificationArm.length}/1000
                </span>
              </div>

            </div>

            {/* =========================
                Buttons
            ========================= */}
            <div className="flex flex-col-reverse sm:flex-row gap-3">

              {/* Clear */}
              <button
                type="button"
                onClick={handleClear}
                disabled={sending}
                className="
                  w-full sm:w-auto
                  px-6 py-3
                  rounded-xl
                  font-semibold
                  text-gray-600
                  bg-gray-100
                  hover:bg-gray-200
                  transition
                  disabled:opacity-50
                  disabled:cursor-not-allowed
                "
              >
                Clear
              </button>

              {/* Send */}
              <button
                type="button"
                onClick={handleSend}
                disabled={sending}
                className={`
                  flex-1
                  py-3
                  rounded-xl
                  font-bold
                  text-white
                  transition
                  shadow-md
                  ${
                    sending
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 hover:scale-[1.01] hover:shadow-lg active:scale-[0.99]"
                  }
                `}
              >
                {sending ? (
                  <span className="flex items-center justify-center gap-2">
                    <span
                      className="
                        w-5 h-5
                        border-2
                        border-white
                        border-t-transparent
                        rounded-full
                        animate-spin
                      "
                    ></span>

                    Sending...
                  </span>
                ) : (
                  "🔔 Send Notification"
                )}
              </button>

            </div>
          </div>
        </div>

        {/* =========================
            Information Box
        ========================= */}
        <div className="mt-5 bg-blue-50 border border-blue-100 rounded-xl p-4">

          <div className="flex gap-3">

            <div className="text-xl">
              ℹ️
            </div>

            <div>
              <h3 className="font-semibold text-blue-800 text-sm">
                Notification groups
              </h3>

              <p className="text-sm text-blue-700 mt-1">
                Couriers, managers, and users will receive the
                notification according to the selected group.
              </p>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}