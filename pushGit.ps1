# Stage all changes (including new, modified, and deleted files)
git add .

# Generate a timestamp in the format "yyyy-MM-dd HH:mm:ss"
$timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"

# Create the commit message with the timestamp
$commitMessage = "Commit $timestamp"

# Commit the changes. If there are no staged changes, this will do nothing.
git commit -m $commitMessage

# Push to the default remote branch (here: origin/main). Adjust if needed.
git push origin main