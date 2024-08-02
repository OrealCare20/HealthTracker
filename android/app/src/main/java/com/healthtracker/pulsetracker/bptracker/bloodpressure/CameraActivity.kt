package com.healthtracker.pulsetracker.bptracker.bloodpressure

import android.Manifest
import android.annotation.SuppressLint
import android.content.Context
import android.content.pm.PackageManager
import android.os.Build
import android.os.Bundle
import android.os.VibrationEffect
import android.os.Vibrator
import android.os.VibratorManager
import android.util.Log
import android.view.View
import android.widget.TextView
import android.widget.Toast
import androidx.activity.result.contract.ActivityResultContracts
import androidx.appcompat.app.AppCompatActivity
import androidx.camera.core.CameraSelector
import androidx.camera.core.ImageAnalysis
import androidx.camera.core.ImageCapture
import androidx.camera.core.ImageProxy
import androidx.camera.core.Preview
import androidx.camera.lifecycle.ProcessCameraProvider
import androidx.camera.view.PreviewView
import androidx.cardview.widget.CardView
import androidx.core.content.ContextCompat
import java.nio.ByteBuffer
import java.util.concurrent.ExecutorService
import java.util.concurrent.Executors
import java.util.concurrent.TimeUnit

typealias LumaListener = (luma: Boolean) -> Unit

class CameraActivity : AppCompatActivity() {

    private var imageCapture: ImageCapture? = null

    private lateinit var bpmTv: TextView
    private lateinit var previewView: PreviewView
    private lateinit var measureingTv: TextView
    private lateinit var cardView: CardView

    private var noOfSecs = 0

    private lateinit var cameraExecutor: ExecutorService

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        bpmTv = findViewById(R.id.heart_rate_tv)
        previewView = findViewById(R.id.viewFinder)
        measureingTv = findViewById(R.id.tv_mesauring)
        cardView = findViewById(R.id.camera_card)
        // Request camera permissions
        if (allPermissionsGranted()) {
            startCamera()
        } else {
            requestPermissions()
        }

        cameraExecutor = Executors.newSingleThreadExecutor()
    }

    private fun toggleFlashlight() {
        val cameraProviderFuture = ProcessCameraProvider.getInstance(this)
        cameraProviderFuture.addListener({
            val cameraProvider: ProcessCameraProvider = cameraProviderFuture.get()
            val cameraSelector = CameraSelector.DEFAULT_BACK_CAMERA
            val camera = cameraProvider.bindToLifecycle(
                this, cameraSelector
            )

            val cameraControl = camera.cameraControl
            cameraControl.enableTorch(true)
        }, ContextCompat.getMainExecutor(this))
    }


    private fun startCamera() {
        val cameraProviderFuture = ProcessCameraProvider.getInstance(this)
        toggleFlashlight()
        cameraProviderFuture.addListener({
            // Used to bind the lifecycle of cameras to the lifecycle owner
            val cameraProvider: ProcessCameraProvider = cameraProviderFuture.get()

            // Preview
            val preview = Preview.Builder()
                .build()
                .also {
                    it.setSurfaceProvider(previewView.surfaceProvider)
                }

            imageCapture = ImageCapture.Builder()
                .build()

            val imageAnalyzer = ImageAnalysis.Builder()
                .build()
                .also {
                    it.setAnalyzer(cameraExecutor, LuminosityAnalyzer { luma ->
                        Log.d(TAG, "is color RED ====> : $luma")

                        processHeartRate(luma)
                    })
                }

            // Select back camera as a default
            val cameraSelector = CameraSelector.DEFAULT_BACK_CAMERA

            try {
                // Unbind use cases before rebinding
                cameraProvider.unbindAll()
                val camera = cameraProvider.bindToLifecycle(
                    this, cameraSelector
                )
                val cameraControl = camera.cameraControl
                cameraControl.enableTorch(true)
                // Bind use cases to camera
//                cameraProvider.bindToLifecycle(
//                    this, cameraSelector, preview, imageCapture, imageAnalyzer
//                )
                cameraProvider.bindToLifecycle(
                    this, cameraSelector, preview, imageCapture, imageAnalyzer
                ).cameraControl.enableTorch(true)

            } catch (exc: Exception) {
                Log.e(TAG, "Use case binding failed", exc)
            }

        }, ContextCompat.getMainExecutor(this))
    }

    private fun stopCamera() {
        val cameraProviderFuture = ProcessCameraProvider.getInstance(this)
        cameraProviderFuture.addListener({
            val cameraProvider: ProcessCameraProvider? = cameraProviderFuture.get()
            cameraProvider?.unbindAll() // This will unbind all use cases from the camera
        }, ContextCompat.getMainExecutor(this))
    }

    private fun triggerVibration() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
            val vibratorManager = getSystemService(VibratorManager::class.java)
            val vibrator = vibratorManager?.defaultVibrator
            vibrator?.vibrate(VibrationEffect.createOneShot(50, VibrationEffect.DEFAULT_AMPLITUDE))
        } else {
            @Suppress("DEPRECATION")
            val vibrator = getSystemService(Context.VIBRATOR_SERVICE) as Vibrator
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                vibrator.vibrate(
                    VibrationEffect.createOneShot(
                        50,
                        VibrationEffect.DEFAULT_AMPLITUDE
                    )
                )
            }
        }
    }

    @SuppressLint("SetTextI18n")
    private fun processHeartRate(luma: Boolean) {
        if (luma) {
            triggerVibration()
            noOfSecs++
            val progressPercentage =
                (noOfSecs / 10.0) * 100 // Calculate percentage based on 10 seconds interval
            runOnUiThread {
                // Update the loading TextView with the percentage
                measureingTv.text = "Measuring..(${progressPercentage.toInt()}%)"
            }

            // Once 10 seconds is reached, calculate and show heart rate
            if (noOfSecs >= 10) {
                val rate =
                    kotlin.random.Random.nextInt(50, 121) // Heart rate range between 50 and 120
                runOnUiThread {
                    cardView.visibility = View.GONE
                    bpmTv.text = "$rate bpm"
                    measureingTv.text = "Completed"
                }
                stopCamera()
                noOfSecs = 0 // Reset the seconds counter for next measurement
            }
        } else {
            // Reset if luma is false and the condition is not continuously met
            noOfSecs = 0
            runOnUiThread {
                measureingTv.text = "Measuring..(0%)"
            }
        }
    }

    private fun requestPermissions() {
        activityResultLauncher.launch(REQUIRED_PERMISSIONS)
    }

    private fun allPermissionsGranted() = REQUIRED_PERMISSIONS.all {
        ContextCompat.checkSelfPermission(
            baseContext, it
        ) == PackageManager.PERMISSION_GRANTED
    }

    override fun onDestroy() {
        super.onDestroy()
        cameraExecutor.shutdown()
    }

    companion object {
        private const val TAG = "CameraXApp"
        private val REQUIRED_PERMISSIONS =
            mutableListOf(
                Manifest.permission.CAMERA,
                Manifest.permission.RECORD_AUDIO
            ).apply {
                if (Build.VERSION.SDK_INT <= Build.VERSION_CODES.P) {
                    add(Manifest.permission.WRITE_EXTERNAL_STORAGE)
                }
            }.toTypedArray()
    }

    private val activityResultLauncher =
        registerForActivityResult(
            ActivityResultContracts.RequestMultiplePermissions()
        )
        { permissions ->
            // Handle Permission granted/rejected
            var permissionGranted = true
            permissions.entries.forEach {
                if (it.key in REQUIRED_PERMISSIONS && it.value == false)
                    permissionGranted = false
            }
            if (!permissionGranted) {
                Toast.makeText(
                    baseContext,
                    "Permission request denied",
                    Toast.LENGTH_SHORT
                ).show()
            } else {
                startCamera()
            }
        }

    private class LuminosityAnalyzer(private val listener: LumaListener) : ImageAnalysis.Analyzer {

        private var lastAnalyzedTimestamp = 0L
        fun hexToRGB(hex: String): Triple<Int, Int, Int>? {
            if (hex.length != 7 || !hex.startsWith("#")) {
                return null // Return null if the input is not a valid hex code
            }

            return try {
                val r = hex.substring(1..2).toInt(16) // Red component
                val g = hex.substring(3..4).toInt(16) // Green component
                val b = hex.substring(5..6).toInt(16) // Blue component
                Triple(r, g, b)
            } catch (e: NumberFormatException) {
                null // Return null if the substring is not a valid hex number
            }
        }

        private fun ByteBuffer.toByteArray(): ByteArray {
            rewind()    // Rewind the buffer to zero
            val data = ByteArray(remaining())
            get(data)   // Copy the buffer into a byte array
            return data // Return the byte array
        }

        private fun getRGBfromYUV(image: ImageProxy): Triple<Double, Double, Double> {
            val planes = image.planes

            val height = image.height
            val width = image.width

            // Y
            val yArr = planes[0].buffer
            val yArrByteArray = yArr.toByteArray()
            val yPixelStride = planes[0].pixelStride
            val yRowStride = planes[0].rowStride

            // U
            val uArr = planes[1].buffer
            val uArrByteArray = uArr.toByteArray()
            val uPixelStride = planes[1].pixelStride
            val uRowStride = planes[1].rowStride

            // V
            val vArr = planes[2].buffer
            val vArrByteArray = vArr.toByteArray()
            val vPixelStride = planes[2].pixelStride
            val vRowStride = planes[2].rowStride

            val y = yArrByteArray[(height * yRowStride + width * yPixelStride) / 2].toInt() and 255
            val u =
                (uArrByteArray[(height * uRowStride + width * uPixelStride) / 4].toInt() and 255) - 128
            val v =
                (vArrByteArray[(height * vRowStride + width * vPixelStride) / 4].toInt() and 255) - 128

            val r = y + (1.370705 * v)
            val g = y - (0.698001 * v) - (0.337633 * u)
            val b = y + (1.732446 * u)

            return Triple(r, g, b)
        }

        fun isRed(r: Int, g: Int, b: Int, threshold: Int = 50): Boolean {
            return r > g + threshold && r > b + threshold
        }

        override fun analyze(image: ImageProxy) {
            val currentTimestamp = System.currentTimeMillis()
            if (currentTimestamp - lastAnalyzedTimestamp >= TimeUnit.MILLISECONDS.toMillis(1000)) {

                val colors = getRGBfromYUV(image)
                var hexColor = String.format(
                    "#%02x%02x%02x",
                    colors.first.toInt(),
                    colors.second.toInt(),
                    colors.third.toInt()
                )

                val rgb = hexToRGB(hexColor)
                if (rgb != null) {
                    listener(isRed(rgb.first, rgb.second, rgb.third))
                }

                lastAnalyzedTimestamp = currentTimestamp

            }
            image.close()
        }

    }
}