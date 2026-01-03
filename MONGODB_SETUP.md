# MongoDB Setup Guide (हिंदी में)

## ❌ Error:
```
MongooseServerSelectionError: connect ECONNREFUSED ::1:27017
```

यह error इसलिए आ रहा है क्योंकि **MongoDB server चल नहीं रहा है**।

## ✅ Solution - 2 Options:

### Option 1: Local MongoDB (अगर आपने install किया है)

**Step 1: MongoDB Start करें**

**Windows:**
```powershell
# MongoDB service start करें
net start MongoDB
```

**या MongoDB को manually start करें:**
```powershell
# MongoDB bin folder में जाएं (usually)
cd "C:\Program Files\MongoDB\Server\7.0\bin"
.\mongod.exe
```

**Step 2: Check करें MongoDB चल रहा है:**
```powershell
# नया terminal खोलें
mongosh
```

अगर MongoDB चल रहा है, तो `mongosh` command काम करेगी।

### Option 2: MongoDB Atlas (Cloud - Recommended) ⭐

यह **सबसे आसान** तरीका है - कोई installation नहीं!

**Step 1: MongoDB Atlas Account बनाएं**
1. https://www.mongodb.com/cloud/atlas पर जाएं
2. Free account बनाएं (Free tier available)
3. Create a free cluster

**Step 2: Connection String लें**
1. Atlas dashboard में जाएं
2. "Connect" button click करें
3. "Connect your application" select करें
4. Connection string copy करें (जैसे):
   ```
   mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/cardora?retryWrites=true&w=majority
   ```

**Step 3: .env file में add करें**

`.env` file बनाएं (अगर नहीं है) ROOT folder में:

```env
MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/cardora?retryWrites=true&w=majority
```

**Step 4: Server restart करें**

```powershell
# Server को restart करें
npm run dev:backend
```

## 🔧 Quick Fix - Deprecated Warnings

मैंने `server/index.js` में deprecated options हटा दिए हैं। अब warnings नहीं आएंगी।

## ✅ Check करें:

अगर MongoDB connect हो गया, तो आपको यह दिखेगा:
```
✅ MongoDB Connected
🚀 Server running on port 5000
```

## 📝 Recommendation:

**MongoDB Atlas use करें** - यह:
- ✅ Free है
- ✅ Setup आसान है
- ✅ कोई local installation नहीं चाहिए
- ✅ Cloud में है, हमेशा available

## 🚀 Next Steps:

1. MongoDB Atlas account बनाएं (5 minutes)
2. Connection string `.env` में add करें
3. Server restart करें
4. Done! ✅

