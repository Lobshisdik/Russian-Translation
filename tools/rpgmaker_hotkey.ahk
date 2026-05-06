#NoEnv
#SingleInstance Force
#MaxHotkeysPerInterval 99000000
#HotkeyInterval 99000000
#KeyHistory 0
ListLines Off
Process, Priority, , A
SetKeyDelay, -1, -1
SetMouseDelay, -1
SetDefaultMouseSpeed, 0
SetWinDelay, -1
SetControlDelay, -1
SendMode Input

; Only activate this hotkey when RPG Maker MZ is the active window
#IfWinActive, ahk_exe RPGMZ.dat
\::
    ; Send Ctrl+1, wait a bit, then send Enter
    Send, ^1
    Sleep, 50
    Send, {Enter}
return

Tab::
    ; Tab cycles through drawing tools/layers
    Send, {Tab}
return
#IfWinActive