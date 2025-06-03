#!/bin/bash
cd /home/kavia/workspace/code-generation/tripfusion-19-7a4b1202/tripfusion_main_container
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

