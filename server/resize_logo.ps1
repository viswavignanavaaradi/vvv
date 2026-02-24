Add-Type -AssemblyName System.Drawing
try {
    $src = "c:\ngo\client\src\assets\logo.png"
    $dest = "c:\ngo\server\utils\logo_small.png"
    
    if (-not (Test-Path $src)) {
        Write-Error "Source file not found: $src"
        exit 1
    }

    $img = [System.Drawing.Image]::FromFile($src)
    $newImg = New-Object System.Drawing.Bitmap(300, 300)
    $g = [System.Drawing.Graphics]::FromImage($newImg)
    
    # High quality resize
    $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
    $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
    $g.CompositingQuality = [System.Drawing.Drawing2D.CompositingQuality]::HighQuality

    $g.DrawImage($img, 0, 0, 300, 300)
    
    $newImg.Save($dest, [System.Drawing.Imaging.ImageFormat]::Png)
    
    $g.Dispose()
    $img.Dispose()
    $newImg.Dispose()
    
    Write-Host "Successfully resized logo to $dest"
} catch {
    Write-Error "Failed to resize image: $_"
    exit 1
}
