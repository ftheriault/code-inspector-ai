package com.aifuture.pi.test;

import java.awt.Image;
import java.awt.image.BufferedImage;
import java.io.BufferedReader;
import java.io.File;
import java.io.InputStreamReader;
import java.io.PrintWriter;
import java.net.Socket;

import javax.imageio.ImageIO;

import org.json.simple.JSONArray; 
import org.json.simple.JSONValue;    

public class Main {

	public static void main(String[] args) {
		String hostName = "192.168.1.115";
		int portNumber = 8000;
		long start = System.currentTimeMillis();

		try { 
		    Socket socket = new Socket(hostName, portNumber);
		    PrintWriter out = new PrintWriter(socket.getOutputStream(), true);
		    
		    System.out.println("---------------------------");
			
			String line = null;
			BufferedReader  reader = new BufferedReader(new InputStreamReader(socket.getInputStream()));
			line = reader.readLine();

			System.out.println("---------------------------");
			System.out.println("Msec = " + (System.currentTimeMillis() - start));
			
			Object obj=JSONValue.parse(line);
			JSONArray array=(JSONArray)obj;
			FrameImage img = new FrameImage(array);
			img.setVisible(true);
			img.repaint();
 

			// If received As JPG
			//BufferedImage image = ImageIO.read(socket.getInputStream());
			//ImageIO.write(image, "jpg", new File("test.jpg"));

		}
		catch (Exception e) {
			e.printStackTrace();
		}
	}
}
