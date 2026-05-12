import * as signalR from "@microsoft/signalr";
import { getUser } from "../utils/auth";

const HUB_URL = "https://localhost:7071/hubs/notifications";

class SignalRService {
  connection = null;
  startPromise = null;
  callbacks = new Set();
  currentUserId = null; 

  async startConnection(userId) {
    if (!userId) return;

    if (
      this.currentUserId === userId &&
      this.connection?.state === signalR.HubConnectionState.Connected
    ) {
      return;
    }

  
    if (this.startPromise) {
      return this.startPromise;
    }

    this.startPromise = (async () => {
      try {
      
        if (this.connection) {
          await this.connection.stop().catch(() => {});
          this.connection = null;
        }

        const token = getUser()?.token;

        this.connection = new signalR.HubConnectionBuilder()
          .withUrl(HUB_URL, {
            accessTokenFactory: () => getUser()?.token || "", 
            withCredentials: true,
          })
          .withAutomaticReconnect()
          .configureLogging(signalR.LogLevel.Information)
          .build();

        this.connection.on("ReceiveNotification", (notification) => {
          console.log("🔔 Notification received:", notification);
          this.callbacks.forEach((cb) => cb(notification));
        });

        this.connection.onreconnecting((err) => {
          console.log("Reconnecting...", err);
        });

        this.connection.onreconnected(async () => {
          console.log("Reconnected");
          await this.connection.invoke("JoinUserGroup", userId.toString());
        });

        this.connection.onclose((err) => {
          console.log("SignalR disconnected", err);
          this.currentUserId = null; 
        });

        await this.connection.start();
        await this.connection.invoke("JoinUserGroup", userId.toString());

        this.currentUserId = userId;
        console.log(`✅ SignalR connected as user_${userId}`);
      } catch (err) {
        console.error("❌ SignalR error:", err);
        this.currentUserId = null;
      } finally {
        this.startPromise = null;
      }
    })();

    return this.startPromise;
  }

  onReceiveNotification(callback) {
    this.callbacks.add(callback);
  }

  offReceiveNotification(callback) {
    if (callback) {
      this.callbacks.delete(callback);
    } else {
      this.callbacks.clear();
    }
  }

  onNotificationRead(callback) {
    this.connection?.on("NotificationRead", callback);
  }

  offNotificationRead(callback) {
    this.connection?.off("NotificationRead", callback);
  }

  async stopConnection() {
    this.callbacks.clear();
    this.currentUserId = null; 

    try {
      if (this.connection) {
        await this.connection.stop();
      }
    } catch (err) {
      console.error(err);
    }

    this.connection = null;
  }
}

export default new SignalRService();