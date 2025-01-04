import { useThemeStore } from "../store/useThemeStore";
import {Send,Mail,Loader2} from "lucide-react";
import {THEMES} from "../constants"
import { useChatStore } from "../store/useChatStore";
import { useState } from "react";

const PREVIEW_MESSAGES = [
  { id: 1, content: "Hey! How are you doing?", isSent: false },
  { id: 2, content: "great! just too busy nowadays.", isSent: true },
];

export const SettingsPage = () => {

  const {theme, setTheme} = useThemeStore();
  const {isContactAdding, addContacts} = useChatStore();
  const {isContactDeleting, deleteContacts} = useChatStore();

  const [formData,setFormData] = useState({
    email : "",
  });

  const [formDataDuplicate,setFormDataDuplicate] = useState({
    email : "",
  });

  const addHandleSubmit = (event)=>{
    event.preventDefault();
    addContacts(formData);
  } ;

  const deleteHandleSubmit = (event)=>{
    event.preventDefault();
    deleteContacts(formDataDuplicate);
  } ;


  return (
    <div className="h-screen container mx-auto px-4 pt-10 max-w-5xl ">
      <div className="space-y-6 pb-10">
        <div className="flex flex-col gap-1">
          <h2 className="text-lg font-semibold">Theme</h2>
          <p className="text-sm text-base-content/70">Choose a theme you like</p>
        </div>

        <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2">
          {THEMES.map((t) => (
            <button
              key={t}
              className={`
                group flex flex-col items-center gap-1.5 p-2 rounded-lg transition-colors
                ${theme === t ? "bg-base-200" : "hover:bg-base-200/50"}
              `}
              onClick={() => setTheme(t)}
            >
              <div className="relative h-8 w-full rounded-md overflow-hidden" data-theme={t}>
                <div className="absolute inset-0 grid grid-cols-4 gap-px p-1">
                  <div className="rounded bg-primary"></div>
                  <div className="rounded bg-secondary"></div>
                  <div className="rounded bg-accent"></div>
                  <div className="rounded bg-neutral"></div>
                </div>
              </div>
              <span className="text-[11px] font-medium truncate w-full text-center">
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </span>
            </button>
          ))}
        </div>

        <form onSubmit={addHandleSubmit} className='space-y-6 flex flex-col gap-1'>


            {/* here goes email input  */}
            <div className="flex flex-col gap-1">
              <h2 className="text-lg font-semibold">Add Contacts</h2>
              <p className="text-sm text-base-content/70">type the email of contact you like to add:</p>
           </div>

            <div className="form-control">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="size-5 text-base-content/40" />
                </div>
                <input
                  type="email"
                  className={`input input-bordered w-full pl-10`}
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={(event) => setFormData({ ...formData, email: event.target.value })}
                />
              </div>
            </div>

            {/* this is my submit button and for having a loading functionality while submiting */}
            <button type="submit" className="btn btn-primary w-full" disabled={isContactAdding}>
              {isContactAdding ? (
                <>
                  <Loader2 className="size-5 animate-spin" />
                  Loading...
                </>
              ) : (
                "Add contact"
              )}
            </button>

        </form>

        <form onSubmit={deleteHandleSubmit} className='space-y-6 flex flex-col gap-1'>


            {/* here goes email input  */}
            <div className="flex flex-col gap-1">
              <h2 className="text-lg font-semibold">Delete a contact</h2>
              <p className="text-sm text-base-content/70">type the email of contact you like to delete:</p>
           </div>

            <div className="form-control">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="size-5 text-base-content/40" />
                </div>
                <input
                  type="email"
                  className={`input input-bordered w-full pl-10`}
                  placeholder="you@example.com"
                  value={formDataDuplicate.email}
                  onChange={(event) => setFormDataDuplicate({ ...formDataDuplicate, email: event.target.value })}
                />
              </div>
            </div>

            {/* this is my submit button and for having a loading functionality while submiting */}
            <button type="submit" className="btn btn-primary w-full" disabled={isContactDeleting}>
              {isContactDeleting ? (
                <>
                  <Loader2 className="size-5 animate-spin" />
                  Loading...
                </>
              ) : (
                "Delete Contact"
              )}
            </button>

        </form>

        {/* Preview Section */}
        <h3 className="text-lg font-semibold mb-3">Preview</h3>
        <div className="rounded-xl border border-base-300 overflow-hidden bg-base-100 shadow-lg">
          <div className="p-4 bg-base-200">
            <div className="max-w-lg mx-auto">
              {/* Mock Chat UI */}
              <div className="bg-base-100 rounded-xl shadow-sm overflow-hidden">
                {/* Chat Header */}
                <div className="px-4 py-3 border-b border-base-300 bg-base-100">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-content font-medium">
                      D
                    </div>
                    <div>
                      <h3 className="font-medium text-sm">Dhruv Bajaj</h3>
                      <p className="text-xs text-base-content/70">Online</p>
                    </div>
                  </div>
                </div>

                {/* Chat Messages */}
                <div className="p-4 space-y-4 min-h-[200px] max-h-[200px] overflow-y-auto bg-base-100">
                  {PREVIEW_MESSAGES.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.isSent ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`
                          max-w-[80%] rounded-xl p-3 shadow-sm
                          ${message.isSent ? "bg-primary text-primary-content" : "bg-base-200"}
                        `}
                      >
                        <p className="text-sm">{message.content}</p>
                        <p
                          className={`
                            text-[10px] mt-1.5
                            ${message.isSent ? "text-primary-content/70" : "text-base-content/70"}
                          `}
                        >
                          12:00 PM
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Chat Input */}
                <div className="p-4 border-t border-base-300 bg-base-100">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      className="input input-bordered flex-1 text-sm h-10"
                      placeholder="Type a message..."
                      value="This is a preview"
                      readOnly
                    />
                    <button className="btn btn-primary h-10 min-h-0">
                      <Send size={18} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        
        <div className="border-t text-center py-6">
          <p className="text-sm">
             Please let us know at pinkclient1@gmail.com if you find some bugs.
          </p>
        </div>

      </div>

    </div>
  );
};

