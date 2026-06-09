$url = "https://photos.app.goo.gl/TSYfXpw1zqxi59BV9"
Write-Host "Fetching URL: $url"

try {
    $response = Invoke-WebRequest -Uri $url -MaximumRedirection 5 -UserAgent "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
    $html = $response.Content
    Write-Host "HTML Length: $($html.Length)"
    Write-Host "Final URL: $($response.BaseResponse.ResponseUri.AbsoluteUri)"
    
    # Extract lh3.googleusercontent.com/pw/ links
    $matches = [regex]::Matches($html, 'https://lh3\.googleusercontent\.com/pw/[a-zA-Z0-9\-_]{50,}')
    Write-Host "Found matches: $($matches.Count)"
    
    if ($matches.Count -gt 0) {
        # Get unique matches
        $uniqueMatches = @()
        foreach ($match in $matches) {
            if ($uniqueMatches -notcontains $match.Value) {
                $uniqueMatches += $match.Value
            }
        }
        Write-Host "Unique matches: $($uniqueMatches.Count)"
        Write-Host "First 3 matches:"
        for ($i = 0; $i -lt [Math]::Min(3, $uniqueMatches.Count); $i++) {
            Write-Host "$($i + 1): $($uniqueMatches[$i])=w1200"
        }
    }
} catch {
    Write-Host "Error fetching URL: $_"
}
