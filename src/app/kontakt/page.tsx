"use client";

import React, { useState } from 'react';
import Link from 'next/link';

export default function Kontakt() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);
    
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Något gick fel vid skickande av meddelandet');
      }
      
      setSubmitSuccess(true);
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      });
    } catch (error) {
      console.error('Fel vid skickande av kontaktformulär:', error);
      setSubmitError(error instanceof Error ? error.message : 'Något gick fel vid skickande av meddelandet');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <main className="bg-gray-50 py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">Kontakta oss</h1>
            <p className="text-gray-600 mb-8 md:mb-12">
              Har du frågor eller funderingar? Vi finns här för att hjälpa dig.
            </p>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-white rounded-lg shadow-sm p-6 md:p-8">
                <h2 className="text-xl md:text-2xl font-semibold mb-6 text-gray-800">Kontaktinformation</h2>
                
                <div className="space-y-6">
                  <div className="flex items-start">
                    <div className="bg-[hsl(var(--primary))] rounded-full p-2 mr-4 flex-shrink-0">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-800">E-post</h3>
                      <a href="mailto:slotskolan@gmail.com" className="text-[hsl(var(--primary))] hover:underline">
                        slotskolan@gmail.com
                      </a>
                      <p className="text-gray-600 text-sm mt-1">
                        För snabbast svar, mejla oss direkt på denna adress.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="bg-[hsl(var(--primary))] rounded-full p-2 mr-4 flex-shrink-0">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-800">Svarstid</h3>
                      <p className="text-gray-600">Vi svarar vanligtvis inom 24 timmar</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="bg-[hsl(var(--primary))] rounded-full p-2 mr-4 flex-shrink-0">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-800">Sociala medier</h3>
                      <div className="flex space-x-3 mt-2">
                        <a href="https://discord.gg/din-discord-inbjudan" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-[hsl(var(--primary))]">
                          Discord
                        </a>
                        <a href="https://twitch.tv/slotskolan" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-[hsl(var(--primary))]">
                          Twitch
                        </a>
                        <a href="https://x.com/slotskolan" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-[hsl(var(--primary))]">
                          Twitter
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-8">
                  <h3 className="font-medium text-gray-800 mb-2">Vanliga frågor</h3>
                  <p className="text-gray-600 mb-3">
                    Innan du kontaktar oss, kolla gärna om din fråga redan besvarats i vår FAQ.
                  </p>
                  <Link 
                    href="/faq" 
                    className="inline-block px-4 py-2 bg-gray-100 text-gray-700 rounded-md font-medium hover:bg-gray-200 transition-colors"
                  >
                    Besök vår FAQ
                  </Link>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow-sm p-6 md:p-8">
                <h2 className="text-xl md:text-2xl font-semibold mb-4 text-gray-800">Skicka meddelande</h2>
                
                <p className="text-gray-600 mb-4">
                  <strong>OBS:</strong> Detta är en demoversion av kontaktformuläret. Inga meddelanden skickas.
                </p>
                
                {submitSuccess ? (
                  <div className="bg-green-50 border border-green-200 text-green-700 p-4 rounded-md mb-4">
                    <div className="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <p className="font-medium">Tack för ditt meddelande!</p>
                    </div>
                    <p className="mt-2">Vi kommer att kontakta dig så snart som möjligt.</p>
                    <button 
                      onClick={() => setSubmitSuccess(false)}
                      className="mt-3 text-sm text-green-700 underline"
                    >
                      Skicka ett nytt meddelande
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    {submitError && (
                      <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-md mb-4">
                        <div className="flex items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <p className="font-medium">Det gick inte att skicka meddelandet</p>
                        </div>
                        <p className="mt-1">{submitError}</p>
                      </div>
                    )}
                    
                    <div>
                      <label htmlFor="name" className="block text-gray-700 font-medium mb-1">Namn</label>
                      <input 
                        type="text" 
                        id="name" 
                        name="name" 
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[hsl(var(--primary))] focus:border-transparent"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="email" className="block text-gray-700 font-medium mb-1">E-post</label>
                      <input 
                        type="email" 
                        id="email" 
                        name="email" 
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[hsl(var(--primary))] focus:border-transparent"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="subject" className="block text-gray-700 font-medium mb-1">Ämne (valfritt)</label>
                      <input 
                        type="text" 
                        id="subject" 
                        name="subject" 
                        value={formData.subject}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[hsl(var(--primary))] focus:border-transparent"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="message" className="block text-gray-700 font-medium mb-1">Meddelande</label>
                      <textarea 
                        id="message" 
                        name="message" 
                        value={formData.message}
                        onChange={handleChange}
                        required
                        rows={5}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[hsl(var(--primary))] focus:border-transparent"
                      ></textarea>
                    </div>
                    
                    <div>
                      <button 
                        type="submit" 
                        disabled={isSubmitting}
                        className={`w-full py-3 px-4 bg-[hsl(var(--primary))] text-white rounded-md font-medium transition-colors ${
                          isSubmitting ? 'opacity-70 cursor-not-allowed' : 'hover:bg-[hsl(var(--primary))]/90'
                        }`}
                      >
                        {isSubmitting ? 'Skickar...' : 'Skicka meddelande (demo)'}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
            
            <div className="bg-[hsl(var(--soft-pink))] rounded-lg p-6 md:p-8 text-center mt-8">
              <h2 className="text-xl font-semibold mb-3 text-gray-800">Ansvarsfullt spelande</h2>
              <p className="text-gray-700 mb-4">
                Om du har frågor om ansvarsfullt spelande eller behöver hjälp med spelproblem, besök vår sida om ansvarsfullt spelande.
              </p>
              <Link 
                href="/ansvarsfullt-spelande" 
                className="inline-block px-6 py-3 bg-[hsl(var(--primary))] text-white rounded-md font-medium hover:bg-[hsl(var(--primary))]/90 transition-colors"
              >
                Läs mer om ansvarsfullt spelande
              </Link>
            </div>
          </div>
        </div>
      </main>
    </>
  );
} 