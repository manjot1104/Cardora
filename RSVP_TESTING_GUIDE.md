# RSVP Testing Guide - Confirm Attendance Functionality

## Step-by-Step Testing Instructions

### Prerequisites
1. Make sure your backend server is running (`npm run dev:backend`)
2. Make sure your frontend is running (`npm run dev:frontend`)
3. You should be logged in to your account

---

## Step 1: Create an Animated Invite

1. **Go to Dashboard → Animated Invites**
   - URL: `http://localhost:3000/dashboard/animated-invite`

2. **Fill in the form:**
   - Select a template (e.g., "Theater Luxury", "Mediterranean Elegance")
   - Groom Name: `John`
   - Bride Name: `Jane`
   - Wedding Date: `December 25, 2024`
   - Venue: `Grand Ballroom, New York`
   - (Optional) Upload couple photo, background image, music

3. **Click "Create Invite Now"** or **"Add to Cart"**
   - This will create the invite and generate a unique slug

4. **Note the Invite URL:**
   - After creating, you'll get a slug like: `john-jane` or `john-jane-1234`
   - Your invite URL will be: `http://localhost:3000/wedding/john-jane`

---

## Step 2: Access the Invite (as a Guest)

1. **Open the invite URL in a new browser/incognito window:**
   ```
   http://localhost:3000/wedding/[your-slug]
   ```
   Example: `http://localhost:3000/wedding/john-jane`

2. **Scroll down to find the "Confirm Attendance" button:**
   - It's usually in the RSVP section
   - Button text: "Confirm Attendance" or "CONFIRM YOUR ATTENDANCE"

---

## Step 3: Test RSVP Submission

1. **Click "Confirm Attendance" button**
   - A modal should open with the RSVP form

2. **Fill in the form:**
   - **Name** (Required): `Test Guest`
   - **Email** (Optional): `test@example.com`
   - **Phone** (Optional): `+1 555-123-4567`
   - **Attending**: Check the box (default: checked)
   - **Number of Guests**: `2`
   - **Dietary Restrictions** (Optional): `Vegetarian`
   - **Message** (Optional): `Looking forward to celebrating with you!`

3. **Click "Confirm RSVP" button**

4. **Expected Result:**
   - Success message: "Thank You! Your RSVP has been confirmed..."
   - Modal closes automatically after 2 seconds
   - You should see a success animation (🎉 emoji)

---

## Step 4: Verify RSVP in Database

### Option A: Check via API

1. **Get RSVPs for your invite:**
   ```bash
   # Replace [your-slug] with your actual invite slug
   curl http://localhost:5000/api/rsvp/[your-slug]
   ```

2. **Expected Response:**
   ```json
   {
     "success": true,
     "rsvps": [
       {
         "guestName": "Test Guest",
         "attending": true,
         "numberOfGuests": 2,
         "createdAt": "2024-..."
       }
     ],
     "stats": {
       "total": 1,
       "attending": 1,
       "declined": 0,
       "totalGuests": 2
     }
   }
   ```

### Option B: Check via MongoDB

1. **Connect to MongoDB:**
   ```bash
   mongosh
   use cardora
   db.rsvps.find().pretty()
   ```

2. **You should see:**
   - `inviteSlug`: Your invite slug
   - `guestName`: "Test Guest"
   - `attending`: true
   - `numberOfGuests`: 2
   - `status`: "confirmed"

---

## Step 5: Check Email Notification

1. **Check the couple's email inbox:**
   - The email address associated with your account
   - Subject: "🎉 New RSVP: Test Guest is attending your wedding!"

2. **Email should contain:**
   - Guest name
   - Email (if provided)
   - Phone (if provided)
   - Attending status
   - Number of guests
   - Dietary restrictions
   - Message

---

## Step 6: Test Different Scenarios

### Scenario 1: Decline RSVP
1. Click "Confirm Attendance"
2. **Uncheck** "I will be attending"
3. Fill name and submit
4. Expected: Status should be "declined"

### Scenario 2: Multiple RSVPs
1. Submit multiple RSVPs with different names
2. Check stats - should show total count

### Scenario 3: Validation
1. Try submitting without name
2. Expected: Form should show error/not submit

### Scenario 4: Empty Optional Fields
1. Submit with only name (no email, phone, etc.)
2. Expected: Should work fine

---

## Troubleshooting

### Issue: Modal doesn't open
- **Check:** Browser console for errors
- **Check:** `onRSVPClick` prop is passed to template
- **Check:** Template has the button with `onClick={onRSVPClick}`

### Issue: RSVP submission fails
- **Check:** Backend server is running
- **Check:** MongoDB connection
- **Check:** API endpoint: `POST /api/rsvp/submit`
- **Check:** Browser console for error messages

### Issue: Email not sending
- **Check:** SMTP configuration in `.env`
- **Check:** `server/utils/email.js` is working
- **Check:** Email service (Gmail, etc.) allows less secure apps

### Issue: Can't find invite URL
- **Check:** Dashboard → Animated Invites
- **Check:** User has `animatedInviteSlug` field in database
- **Check:** Invite was created successfully

---

## Quick Test Checklist

- [ ] Created animated invite
- [ ] Got invite URL/slug
- [ ] Opened invite in browser
- [ ] Found "Confirm Attendance" button
- [ ] Modal opens on click
- [ ] Form fields work correctly
- [ ] RSVP submits successfully
- [ ] Success message appears
- [ ] RSVP saved in database
- [ ] Email notification sent (if configured)
- [ ] Stats update correctly

---

## API Endpoints Reference

- **Submit RSVP:** `POST /api/rsvp/submit`
- **Get RSVPs:** `GET /api/rsvp/:inviteSlug`
- **Get All RSVPs (Dashboard):** `GET /api/rsvp/dashboard/all` (requires auth)
- **Delete RSVP:** `DELETE /api/rsvp/:rsvpId` (requires auth)

---

## Next Steps (Future Features)

1. **Dashboard RSVP View:** Create a page to view all RSVPs
2. **Export to CSV:** Download RSVP list
3. **RSVP Reminders:** Send reminder emails to guests
4. **RSVP Analytics:** Charts and statistics

---

**Need Help?** Check the browser console and server logs for detailed error messages.
