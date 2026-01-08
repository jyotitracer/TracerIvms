package in.co.tracer.tracerobdv2;

import android.app.Notification;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.content.Context;
import android.graphics.BitmapFactory;
import android.graphics.Color;
import android.media.RingtoneManager;
import android.os.Build;
import android.util.Log;
import android.widget.RemoteViews;

import androidx.core.app.NotificationCompat;
import androidx.core.app.NotificationManagerCompat;

import com.google.firebase.messaging.FirebaseMessagingService;
import com.google.firebase.messaging.RemoteMessage;

public class MyFirebaseMessagingService extends FirebaseMessagingService {

    @Override
    public void onMessageReceived(RemoteMessage remoteMessage) {
        super.onMessageReceived(remoteMessage);

        // Extract notification title and body
        String title = remoteMessage.getNotification() != null ? remoteMessage.getNotification().getTitle() : "Default Title";
        String body = remoteMessage.getNotification() != null ? remoteMessage.getNotification().getBody() : "Default Body";

        showCustomNotification(title, body);
    }

    private void showCustomNotification(String title, String body) {
        Context context = getApplicationContext();
        NotificationManager notificationManager = (NotificationManager) context.getSystemService(Context.NOTIFICATION_SERVICE);

        // Define custom layout
        RemoteViews customLayout = new RemoteViews(context.getPackageName(), R.layout.custom_notification);
        customLayout.setTextViewText(R.id.notification_title, title);
        customLayout.setTextViewText(R.id.notification_body, body);

        // Set up NotificationCompat builder
//        NotificationCompat.Builder builder = new NotificationCompat.Builder(context, "default")
//                .setSmallIcon(R.drawable.ic_company_logo) // Replace with your app's notification icon
//                .setStyle(new NotificationCompat.DecoratedCustomViewStyle())
//                .setCustomContentView(customLayout)
//                .setPriority(NotificationCompat.PRIORITY_HIGH);


        NotificationCompat.Builder notificationCompatBuilder =
                new NotificationCompat.Builder(
                        getApplicationContext(), "default");





        if (android.os.Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
            Log.e("TAG","Lollipop and above");
            notificationCompatBuilder
                    .setSmallIcon(R.drawable.tracer_transparent_logo)
                    .setContentTitle(title)
                    .setContentText(body)
                    .setAutoCancel(true)
                    .setPriority(NotificationCompat.PRIORITY_HIGH)
                    .setStyle(new NotificationCompat.BigTextStyle().bigText(body))
                    .setLights(Color.BLUE, 1, 1)
                    .setColor(Color.parseColor("#D52B2C"))
                    .setSound(RingtoneManager.getDefaultUri(RingtoneManager.TYPE_NOTIFICATION))
                    .setGroupSummary(true);

        } else {
            Log.e("TAG","below Lollipop");
            notificationCompatBuilder
                    .setSmallIcon(R.drawable.ic_company_logo)
                    .setContentTitle(title)
                    .setContentText(body)
                    .setAutoCancel(true)
                    .setLargeIcon(BitmapFactory.decodeResource(this.getResources(), R.drawable.ic_company_logo))
                    .setPriority(NotificationCompat.PRIORITY_HIGH)
                    .setStyle(new NotificationCompat.BigTextStyle().bigText(body))
                    .setLights(Color.BLUE, 1, 1)
                    .setSound(RingtoneManager.getDefaultUri(RingtoneManager.TYPE_NOTIFICATION))
                    .setGroupSummary(true);
        }


        Notification notification = notificationCompatBuilder.build();
        NotificationManagerCompat mNotificationManagerCompat = NotificationManagerCompat.from(getApplicationContext());

//        mNotificationManagerCompat.notify((int) System.currentTimeMillis(), notification);



        // Ensure the channel is created for Android 8.0 and above
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            NotificationChannel channel = new NotificationChannel(
                    "default", "Default Channel", NotificationManager.IMPORTANCE_HIGH);
            notificationManager.createNotificationChannel(channel);
        }

       // notificationManager.notify(1, builder.build());
        // Show the notification
        notificationManager.notify(1, notification);
    }
}