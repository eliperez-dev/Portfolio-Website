---
title: Writing a no_std driver for ESP32 in Rust
date: 2025-12-24
description: A deep dive into embedded Rust and how to interface with hardware without the standard library.
tags: ["Rust", "Embedded", "ESP32"]
---

# Writing a no_std driver for ESP32 in Rust

Embedded programming in Rust offers memory safety without garbage collection, making it ideal for systems programming.

## Why no_std?

In embedded environments, we often don't have an operating system. The standard library (`std`) relies on OS features like files, threads, and networking. By using `#![no_std]`, we can run on bare metal.

## The Hardware

We are using an ESP32 microcontroller, which is popular for IoT applications due to its built-in WiFi and Bluetooth capabilities.

```rust
#![no_std]
#![no_main]

use esp_backtrace as _;
use esp_hal::{
    clock::ClockControl, peripherals::Peripherals, prelude::*, system::SystemControl,
};

#[entry]
fn main() -> ! {
    let peripherals = Peripherals::take();
    let system = SystemControl::new(peripherals.SYSTEM);
    let clocks = ClockControl::boot_defaults(system.clock_control).freeze();

    loop {
        // Blink logic here
    }
}
```

## Creating the Driver

To interface with a sensor, we need to understand the datasheet...
