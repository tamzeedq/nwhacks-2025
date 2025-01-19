# Distributed under the OSI-approved BSD 3-Clause License.  See accompanying
# file Copyright.txt or https://cmake.org/licensing for details.

cmake_minimum_required(VERSION 3.5)

file(MAKE_DIRECTORY
  "/home/diego/esp/v5.4/esp-idf/components/bootloader/subproject"
  "/home/diego/dev/nwPlus/build/bootloader"
  "/home/diego/dev/nwPlus/build/bootloader-prefix"
  "/home/diego/dev/nwPlus/build/bootloader-prefix/tmp"
  "/home/diego/dev/nwPlus/build/bootloader-prefix/src/bootloader-stamp"
  "/home/diego/dev/nwPlus/build/bootloader-prefix/src"
  "/home/diego/dev/nwPlus/build/bootloader-prefix/src/bootloader-stamp"
)

set(configSubDirs )
foreach(subDir IN LISTS configSubDirs)
    file(MAKE_DIRECTORY "/home/diego/dev/nwPlus/build/bootloader-prefix/src/bootloader-stamp/${subDir}")
endforeach()
if(cfgdir)
  file(MAKE_DIRECTORY "/home/diego/dev/nwPlus/build/bootloader-prefix/src/bootloader-stamp${cfgdir}") # cfgdir has leading slash
endif()
