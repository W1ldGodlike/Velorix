@echo off
setlocal EnableExtensions
title Velorix — удаление (распакованная копия)

set "ROOT=%~dp0"
if "%ROOT:~-1%"=="\" set "ROOT=%ROOT:~0,-1%"

echo.
echo velorix: удаление из папки:
echo   %ROOT%
echo.
echo Программа будет удалена вместе с exe и resources.
echo.

set "DELDATA=N"
choice /M "Удалить папку app-data (настройки, загрузки, журналы)?" /C YN /D N /T 30
if errorlevel 2 goto SkipData
if errorlevel 1 set "DELDATA=Y"
:SkipData

if /I "%DELDATA%"=="Y" (
  if exist "%ROOT%\app-data" (
    echo Удаление "%ROOT%\app-data" ...
    rmdir /s /q "%ROOT%\app-data"
  ) else (
    echo Папка app-data не найдена — пропуск.
  )
) else (
  echo Папка app-data сохранена.
)

echo.
echo Удаление файлов приложения ...
for %%F in ("%ROOT%\Velorix.exe" "%ROOT%\Uninstall Velorix.cmd" "%ROOT%\Uninstall-Velorix.cmd") do (
  if exist %%F del /f /q %%F
)
if exist "%ROOT%\resources" rmdir /s /q "%ROOT%\resources"
if exist "%ROOT%\locales" rmdir /s /q "%ROOT%\locales"
if exist "%ROOT%\*.dll" del /f /q "%ROOT%\*.dll"
if exist "%ROOT%\*.pak" del /f /q "%ROOT%\*.pak"
if exist "%ROOT%\*.bin" del /f /q "%ROOT%\*.bin"
if exist "%ROOT%\*.dat" del /f /q "%ROOT%\*.dat"
if exist "%ROOT%\*.json" del /f /q "%ROOT%\LICENSE*" "%ROOT%\version" 2>nul

echo.
echo Готово. Пустую папку "%ROOT%" можно удалить вручную.
echo.
pause
