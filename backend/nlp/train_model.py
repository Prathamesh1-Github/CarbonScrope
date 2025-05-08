import json
import joblib
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.pipeline import Pipeline
from sklearn.naive_bayes import MultinomialNB

# Training data (example, expand this)
training_data = [
    # AI/ML
    ("This project uses convolutional neural networks to classify images", "AI/ML"),
    ("Training a recommendation engine with collaborative filtering", "AI/ML"),
    ("An AI model to predict house prices using regression", "AI/ML"),
    ("Natural language processing tool for text summarization", "AI/ML"),
    ("Speech recognition system using deep learning", "AI/ML"),
    ("Chatbot that learns from customer interaction", "AI/ML"),
    ("Detecting fraud in transactions using machine learning", "AI/ML"),
    ("AI-based system for real-time object detection", "AI/ML"),
    ("Sentiment analysis of Twitter data using NLP", "AI/ML"),
    ("Predicting stock market trends with LSTM networks", "AI/ML"),
    ("Building an AI assistant using transformer models", "AI/ML"),
    ("Recommendation system for e-commerce websites", "AI/ML"),
    ("Training a support vector machine for email spam classification", "AI/ML"),
    ("AI model for medical image diagnosis", "AI/ML"),
    ("Facial recognition attendance system using AI", "AI/ML"),
    ("Time series forecasting with deep neural networks", "AI/ML"),
    ("Self-learning agent using reinforcement learning", "AI/ML"),
    ("AI engine to optimize delivery routes", "AI/ML"),
    ("Smart home automation using machine learning", "AI/ML"),
    ("Text classification using Naive Bayes", "AI/ML"),

    # Blockchain
    ("Building a decentralized application using smart contracts", "Blockchain"),
    ("Creating a wallet integration with Ethereum", "Blockchain"),
    ("Launching an NFT marketplace on Polygon", "Blockchain"),
    ("Building a DeFi platform with staking support", "Blockchain"),
    ("Ethereum smart contract to manage user identities", "Blockchain"),
    ("Smart contract for token issuance", "Blockchain"),
    ("Blockchain-based voting system", "Blockchain"),
    ("A Solidity smart contract to track supply chain", "Blockchain"),
    ("Crypto portfolio tracker using Web3.js", "Blockchain"),
    ("Building a decentralized file storage system", "Blockchain"),
    ("Developing a DAO governance dashboard", "Blockchain"),
    ("Implementing blockchain notarization for documents", "Blockchain"),
    ("Integrating blockchain for certificate verification", "Blockchain"),
    ("Crowdfunding DApp built on Binance Smart Chain", "Blockchain"),
    ("Smart contract to manage subscription payments", "Blockchain"),
    ("Blockchain-based peer-to-peer lending platform", "Blockchain"),
    ("Automated market maker (AMM) on a DEX", "Blockchain"),
    ("Gas fee analyzer for Ethereum network", "Blockchain"),
    ("Multi-chain wallet with real-time token prices", "Blockchain"),
    ("On-chain voting smart contract for governance", "Blockchain"),

    # Web Development
    ("Creating a responsive website using React", "Web Development"),
    ("Building the frontend using Vue and Tailwind", "Web Development"),
    ("Developing an admin dashboard with Angular", "Web Development"),
    ("Landing page with animations and dark mode", "Web Development"),
    ("Blog website using Gatsby and GraphQL", "Web Development"),
    ("E-commerce store built with Next.js", "Web Development"),
    ("Real-time chat app using Socket.IO and Node.js", "Web Development"),
    ("Portfolio website using HTML, CSS, and JavaScript", "Web Development"),
    ("News aggregation site with search and filters", "Web Development"),
    ("Full-stack MERN application for event booking", "Web Development"),
    ("Building a SaaS dashboard with Charts.js", "Web Development"),
    ("Multi-language support for a web application", "Web Development"),
    ("User authentication with JWT in Express app", "Web Development"),
    ("Custom CMS built with Laravel and Blade", "Web Development"),
    ("PWA for offline-first web experience", "Web Development"),
    ("SEO-optimized landing page in Nuxt.js", "Web Development"),
    ("Data visualization dashboard using D3.js", "Web Development"),
    ("Building a file uploader with drag-and-drop", "Web Development"),
    ("Web scraper UI to extract Amazon product data", "Web Development"),
    ("Login + registration system with validation", "Web Development"),

    # App Development
    ("Developing a mobile app with Flutter", "App Development"),
    ("Developing a cross-platform mobile application", "App Development"),
    ("iOS fitness tracking app using Swift", "App Development"),
    ("Android shopping app with payment gateway", "App Development"),
    ("React Native app for real-time chat", "App Development"),
    ("App to manage personal expenses", "App Development"),
    ("Building a to-do list with push notifications", "App Development"),
    ("Weather forecasting app with geolocation", "App Development"),
    ("Hybrid mobile app using Ionic and Angular", "App Development"),
    ("Timer and reminder mobile application", "App Development"),
    ("Building an offline-first mobile note app", "App Development"),
    ("UI/UX prototype for a travel planning app", "App Development"),
    ("App that syncs with Google Calendar", "App Development"),
    ("Language learning app with spaced repetition", "App Development"),
    ("App to track water consumption habits", "App Development"),
    ("Cross-platform habit tracker with charts", "App Development"),
    ("Educational quiz app for school students", "App Development"),
    ("Mobile app for ordering food online", "App Development"),
    ("Mobile barcode scanner with inventory log", "App Development"),
    ("Event app with RSVP and notifications", "App Development"),

    # Command Line App
    ("Writing a Linux automation tool using bash", "Command Line App"),
    ("Shell script to automate file organization", "Command Line App"),
    ("Command line todo list manager in Python", "Command Line App"),
    ("Building a CLI for GitHub repo management", "Command Line App"),
    ("Terminal-based music player using C++", "Command Line App"),
    ("Interactive command-line budget tracker", "Command Line App"),
    ("Command line app to backup files to cloud", "Command Line App"),
    ("CLI weather app using OpenWeatherMap API", "Command Line App"),
    ("Script to batch rename files in a folder", "Command Line App"),
    ("Developing a simple CLI calculator", "Command Line App"),
    ("Creating a command line utility to convert JSON to CSV", "Command Line App"),
    ("CLI tool to generate strong passwords", "Command Line App"),
    ("Command line journal app", "Command Line App"),
    ("Terminal application to download YouTube videos", "Command Line App"),
    ("CLI app to monitor system resource usage", "Command Line App"),
    ("Task automation tool using Python argparse", "Command Line App"),
    ("Git wrapper tool for simplified commands", "Command Line App"),
    ("Building a cron job manager CLI", "Command Line App"),
    ("Command line SSH session logger", "Command Line App"),
    ("CLI tool to scrape links from a webpage", "Command Line App")
]

X, y = zip(*training_data)

# Build and train pipeline
pipeline = Pipeline([
    ('tfidf', TfidfVectorizer()),
    ('clf', MultinomialNB())
])

pipeline.fit(X, y)

# Save model
joblib.dump(pipeline, "domain_classifier.pkl")
print("Model trained and saved as domain_classifier.pkl")
