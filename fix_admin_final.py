import os

file_path = r'c:\ngo\client\src\pages\Admin.jsx'

with open(file_path, 'r', encoding='utf-8') as f:
    lines = f.readlines()

def find_line(pattern, start=0):
    for i in range(start, len(lines)):
        if pattern in lines[i]: return i
    return -1

# Fix 1: Legal Aid Requests Tab (L324-555)
# We need to find the Action Panel close and insert the 3 missing divs
p_profile_idx = find_line("Contact Node") # Error in my previous trace, I should look for actual names
# Let's use more unique keys

# Legal Aid Requests Detail View Fix
req_action_button = find_line("Update & Notify User")
if req_action_button != -1:
    # Action panel ends a few lines after
    req_action_end = find_line("</div>", req_action_button)
    # Right column ends a few lines after Help Card
    req_help_end = find_line("Internal Policy", req_action_end)
    req_help_end = find_line("</div>", req_help_end)
    req_right_col_end = find_line("</div>", req_help_end + 1)
    
    # After req_right_col_end, we MUST have:
    # </div> (lg:col-span-2 close - wait, Col 2 was closed before Right Col)
    # Actually, the Grid contains (Col 1-2) and (Right Col).
    # So after Right Col close, we need Grid close, then animate-in close.
    
    # Let's find the current req block end
    req_block_end = find_line(")}", req_right_col_end)
    # Insert missing divs before req_block_end
    insert_pos = req_block_end
    lines.insert(insert_pos, "                                        </div>\n") # Grid close
    lines.insert(insert_pos + 1, "                                    </div>\n") # Animate-in close

# Fix 2: Donations Tab (L752-923)
don_action_button = find_line("Download Audit Receipt")
if don_action_button != -1:
    don_action_end = find_line("</div>", don_action_button)
    don_right_col_end = find_line("Security Context", don_action_end)
    don_right_col_end = find_line("</div>", don_right_col_end)
    don_right_col_end = find_line("</div>", don_right_col_end + 1)
    don_right_col_end = find_line("</div>", don_right_col_end + 1) # This should be the col3 close
    
    don_block_end = find_line(")}", don_right_col_end)
    insert_pos = don_block_end
    lines.insert(insert_pos, "                                        </div>\n") # Grid close
    lines.insert(insert_pos + 1, "                                    </div>\n") # Animate-in close

# Fix 3: Interns Tab (L926-1084)
int_action_button = find_line("Reject File")
if int_action_button != -1:
    int_action_end = find_line("</div>", int_action_button)
    int_right_col_end = find_line("Contact Node", int_action_end)
    int_right_col_end = find_line("</div>", int_right_col_end)
    int_right_col_end = find_line("</div>", int_right_col_end + 1)
    int_right_col_end = find_line("</div>", int_right_col_end + 1) # This should be the col3 close
    
    int_block_end = find_line(")}", int_right_col_end)
    insert_pos = int_block_end
    lines.insert(insert_pos, "                                        </div>\n") # Grid close
    lines.insert(insert_pos + 1, "                                    </div>\n") # Animate-in close

with open(file_path, 'w', encoding='utf-8') as f:
    f.writelines(lines)

print("Programmatic restoration completed.")
