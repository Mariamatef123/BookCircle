import * as signalR from "@microsoft/signalr";
import { getUser } from "../utils/auth";

const HUB_URL = "https://localhost:7071/hubs/notifications";

class SignalRService {
  connection = null;
  startPromise = null;
  callbacks = new Set(); // ← all registered listeners

  async startConnection(userId) {
    if (!userId) return;

    if (this.connection?.state === signalR.HubConnectionState.Connected) {
      return;
    }

    if (this.startPromise) return this.startPromise;

    this.startPromise = (async () => {
      try {
        if (this.connection) {
          await this.connection.stop().catch(() => {});
          this.connection = null;
        }

        this.connection = new signalR.HubConnectionBuilder()
          .withUrl(HUB_URL, {
            accessTokenFactory: () => getUser()?.token ?? "",
            withCredentials: true,
          })
          .withAutomaticReconnect()
          .configureLogging(signalR.LogLevel.Warning)
          .build();

        this.connection.onclose(() => {
          this.connection = null;
        });

        // Single handler that fans out to every registered callback
        this.connection.on("ReceiveNotification", (notification) => {
          this.callbacks.forEach((cb) => cb(notification));
        });

        await this.connection.start();
        await this.connection.invoke("JoinUserGroup", userId);

        console.log("✅ SignalR connected");
      } catch (err) {
        console.error("SignalR error:", err);
        this.connection = null;
      } finally {
        this.startPromise = null;
      }
    })();

    return this.startPromise;
  }

  // Register a callback — replaces the old onReceiveNotification API
  onReceiveNotification(callback) {
    this.callbacks.add(callback);
  }

  // Unregister a specific callback
  offReceiveNotification(callback) {
    if (callback) {
      this.callbacks.delete(callback);
    } else {
      this.callbacks.clear(); // offReceiveNotification() with no args clears all
    }
  }

  async stopConnection() {
    this.callbacks.clear();
    try {
      await this.connection?.stop();
    } catch { /* empty */ }
    this.connection = null;
  }
  onNotificationRead(callback) {
  this.connection?.on("NotificationRead", callback);
}

offNotificationRead(callback) {
  this.connection?.off("NotificationRead", callback);
}
}

export default new SignalRService();