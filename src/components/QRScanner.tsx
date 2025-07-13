
import { useState, useRef, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { X, Camera } from 'lucide-react'

interface QRScannerProps {
  onScan: (result: string) => void
  onClose: () => void
}

const QRScanner = ({ onScan, onClose }: QRScannerProps) => {
  const [isActive, setIsActive] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const streamRef = useRef<MediaStream | null>(null)

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      })
      streamRef.current = stream
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        setIsActive(true)
      }
    } catch (error) {
      console.error('Error accessing camera:', error)
    }
  }

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop())
      streamRef.current = null
    }
    setIsActive(false)
  }

  const handleManualInput = () => {
    const result = prompt('กรอกรหัส QR Code หรือรหัสสินค้า:')
    if (result) {
      onScan(result)
    }
  }

  useEffect(() => {
    return () => {
      stopCamera()
    }
  }, [])

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <Card className="w-full max-w-md mx-4">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <Camera className="w-5 h-5" />
            <span>QR Code Scanner</span>
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center">
            {isActive ? (
              <video
                ref={videoRef}
                autoPlay
                playsInline
                className="w-full h-full object-cover rounded-lg"
              />
            ) : (
              <div className="text-center">
                <Camera className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                <p className="text-sm text-gray-500">กดเปิดกล้องเพื่อสแกน QR Code</p>
              </div>
            )}
          </div>
          
          <div className="flex space-x-2">
            {!isActive ? (
              <Button onClick={startCamera} className="flex-1">
                เปิดกล้อง
              </Button>
            ) : (
              <Button onClick={stopCamera} variant="outline" className="flex-1">
                ปิดกล้อง
              </Button>
            )}
            <Button onClick={handleManualInput} variant="outline" className="flex-1">
              กรอกเอง
            </Button>
          </div>
          
          <p className="text-xs text-gray-500 text-center">
            หรือกดปุ่ม "กรอกเอง" เพื่อใส่รหัสด้วยตัวเอง
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

export default QRScanner
