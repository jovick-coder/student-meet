import Avatar from "@/components/Avatar";
import Card from "@/components/Card";
import Layout from "@/components/Layout";
import supabase, { getNotificationsFunction } from "@/lib/supabase";
import Cookies from "js-cookie";
import moment from "moment";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Notifications() {
  const [notifications, setNotifications] = useState({
    loading: true,
    data: [],
  });
  const id = Cookies.get("social-id");
  useEffect(() => {
    const channels = supabase
      .channel("custom-insert-channel")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "notification" },
        (payload) => {
          const newNotification = payload.new;
          if (newNotification.user === id) {
            // Update notifications with new data
            setNotifications((prevNotifications) => ({
              loading: false,
              data: [newNotification, ...prevNotifications.data],
            }));
          }
        }
      )
      .subscribe();
  }, []);
  useEffect(() => {
    async function getAllNotification() {
      const notifications = await getNotificationsFunction();
      setNotifications({ loading: false, data: notifications });
    }
    getAllNotification();
  }, []);
  return (
    <Layout>
      <h1 className="text-6xl mb-4 text-gray-400">Notifications</h1>
      <Card noPadding={true}>
        <div className="">
          {notifications.data.map((notification, i) => (
            <div className="border-b border-b-gray-100 p-4" key={i}>
              <div>{notification.message}</div>
              <small>{moment(notification.created_at).fromNow()}</small>
            </div>
          ))}
        </div>
      </Card>
    </Layout>
  );
}