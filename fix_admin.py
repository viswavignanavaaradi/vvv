import os

file_path = r'c:\ngo\client\src\pages\Admin.jsx'

with open(file_path, 'r', encoding='utf-8') as f:
    lines = f.readlines()

def find_line_index(patterns, start_index=0):
    for i in range(start_index, len(lines)):
        if all(p in lines[i] for p in patterns):
            return i
    return -1

# Fix 1: Add missing closing div after interns tab
# The interns tab detail view ends with 'Draft Official Mail' button and its container
intern_mail_idx = find_line_index(['Draft Official Mail'])
if intern_mail_idx != -1:
    # Look for the closing tags that follow
    # We expect:
    # </div> (contact node)
    # </div> (col 3)
    # </div> (grid)
    # </div> (space-y-8)
    # )} (branch)
    # </motion.div>
    # )} (activeTab)
    
    # Let's find where the account tab starts
    account_start_idx = find_line_index(["activeTab === 'account' && ("])
    if account_start_idx != -1:
        # Replace everything from intern_mail_idx + 4 to account_start_idx with the correct closing tags
        # We need to be careful not to delete the account block
        
        replacement = [
            '                                            </div>\n',
            '                                        </div>\n',
            '                                    </div>\n',
            '                                </div>\n',
            '                            </div>\n',
            '                        )}\n',
            '                    </motion.div>\n',
            '                )}\n',
            '\n'
        ]
        
        # We want to replace between the last </div> of interns and the start of account
        # Let's just rewrite the whole section between them
        
        # Start after the button container
        start_replace = intern_mail_idx + 2
        # End at account start minus some lines
        end_replace = account_start_idx
        
        # Check if it looks correct
        print(f"Replacing lines {start_replace} to {end_replace}")
        
        new_content = lines[:start_replace] + replacement + lines[end_replace:]
        lines = new_content

# Fix 2: Fix the AnimatePresence / main / div at the end
account_sec_idx = find_line_index(['Security Protocol'])
if account_sec_idx != -1:
    # Find the end of the file
    last_idx = len(lines) - 1
    
    # Construct the correct ending
    ending = [
        '                            <div className="mt-20 p-8 rounded-3xl bg-orange-50 border border-orange-100">\n',
        '                                <div className="flex gap-4">\n',
        '                                    <span className="text-2xl">⚠️</span>\n',
        '                                    <div>\n',
        '                                        <h5 className="text-orange-900 font-black text-xs uppercase tracking-widest mb-1">Security Protocol</h5>\n',
        '                                        <p className="text-orange-700 text-[10px] font-medium leading-relaxed">\n',
        '                                            All actions in this portal are logged against your ID. Ensure you logout after every session. Two-factor authentication is active on this account.\n',
        '                                        </p>\n',
        '                                    </div>\n',
        '                                </div>\n',
        '                            </div>\n',
        '                        </div>\n',
        '                    </motion.div>\n',
        '                )}\n',
        '            </AnimatePresence>\n',
        '        </main>\n',
        '    </div>\n',
        '</div>\n',
        ');\n',
        '};\n',
        '\n',
        'export default Admin;\n'
    ]
    
    # Replace from Security Protocol container start
    # Let's find the start of that div: mt-20 p-8 rounded-3xl
    sec_div_idx = find_line_index(['mt-20 p-8 rounded-3xl'], account_sec_idx - 5)
    if sec_div_idx != -1:
        print(f"Replacing lines {sec_div_idx} to end")
        new_content = lines[:sec_div_idx] + ending
        lines = new_content

# Remove any accidental ``` at the end
clean_lines = []
for line in lines:
    if line.strip() == '```':
        continue
    clean_lines.append(line)

with open(file_path, 'w', encoding='utf-8') as f:
    f.writelines(clean_lines)

print("Smart fix completed.")
