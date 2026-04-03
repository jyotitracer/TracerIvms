package in.co.tracer.tracerobdv2;

import android.app.Notification;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.content.Context;
import android.graphics.Color;
import android.os.Build;
import android.os.Bundle;
import android.widget.RemoteViews;

import androidx.activity.EdgeToEdge;
import androidx.core.app.NotificationCompat;
import androidx.core.graphics.Insets;
import androidx.core.view.ViewCompat;
import androidx.core.view.WindowCompat;
import androidx.core.view.WindowInsetsCompat;

import com.getcapacitor.BridgeActivity;
import com.google.firebase.FirebaseApp;
import com.google.firebase.messaging.FirebaseMessaging;

public class MainActivity extends BridgeActivity {
    @Override
    public void onCreate(Bundle savedInstanceState) {

        //edge-to-edge
        WindowCompat.setDecorFitsSystemWindows(getWindow(), false);
        EdgeToEdge.enable(this);

        super.onCreate(savedInstanceState);


        ViewCompat.setOnApplyWindowInsetsListener(
                findViewById(android.R.id.content), // Root view of the activity
                (v, windowInsets) -> {
                    Insets gestureInsets = windowInsets.getInsets(WindowInsetsCompat.Type.systemGestures());
                    Insets systemInsets = windowInsets.getInsets(WindowInsetsCompat.Type.systemBars());

                    // Apply padding dynamically
                    v.setPadding(
                            0,
                            systemInsets.top,
                            0,
                            gestureInsets.bottom
                    );

                    return WindowInsetsCompat.CONSUMED;
                }
        );



        FirebaseApp.initializeApp(this);
        FirebaseMessaging firebaseMessaging = FirebaseMessaging.getInstance();

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            NotificationChannel channel = new NotificationChannel(
                    "default",
                    "Default Channel",
                    NotificationManager.IMPORTANCE_HIGH
            );
            channel.setDescription("Custom notifications");
            NotificationManager manager = getSystemService(NotificationManager.class);
            if (manager != null) {
                manager.createNotificationChannel(channel);
            }
        }
    }



    private void showCustomNotification(Context context, String title, String body) {
        NotificationManager notificationManager = (NotificationManager) context.getSystemService(Context.NOTIFICATION_SERVICE);

        RemoteViews customLayout = new RemoteViews(context.getPackageName(), R.layout.custom_notification);
        customLayout.setTextViewText(R.id.notification_title, title);
        customLayout.setTextViewText(R.id.notification_body, body);

        NotificationCompat.Builder builder = new NotificationCompat.Builder(context, "default")
                .setSmallIcon(R.drawable.ic_company_logo) // Replace with your icon
                .setStyle(new NotificationCompat.DecoratedCustomViewStyle())
                .setCustomContentView(customLayout)
                .setPriority(NotificationCompat.PRIORITY_HIGH);

        notificationManager.notify(1, builder.build());
    }



}